import cloudscraper
from bs4 import BeautifulSoup
import time
import requests
import re
import pymongo

def extract(page):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'}
    url = f'https://www.simplyhired.com/search?q=developer&l=Tunis%2C+AR&pn={page}'
    time.sleep(5)
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.content, 'html.parser')
    return soup

def extract_qualifications_from_description(description):
    qualifications = []

    # List of specific qualifications to extract
    specific_qualifications = [
        'javascript', 'linux', 'php', 'json', 'nodejs', 'mongodb', 'apache',
        'laravel', 'unix', 'sql', 'c#', 'mvc', 'computer science',
        'Angular', 'REST', 'Web services', 'IBM iSeries', 'RPG', 'PL',
        'software development', 'iOS', 'Java', 'Computer Science', 'jQuery',
        '.NET', 'HTML5', 'C#', 'Software troubleshooting', 'Communication skills','Nodejs','React','Python','MySQL','UI design','Full-stack development','Databases'
    ]

    # Create a pattern to match any of the specific qualifications
    pattern = r'\b(?:' + '|'.join(specific_qualifications) + r')\b'

    matches = re.findall(pattern, description, re.IGNORECASE)
    
    # Remove duplicates by converting the list to a set and back to a list
    qualifications.extend(list(set(matches)))

    return qualifications


def extract_job_details(job_url):
    scraper = cloudscraper.create_scraper()
    response = scraper.get(job_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    title = soup.find('h2', class_='chakra-heading css-yvgnf2').text.strip()
    description = soup.find('div', class_='css-cxpe4v').get_text('\n').strip()
    qualifications = extract_qualifications_from_description(description)
    
    return {'title': title, 'skills': qualifications}

def transform(soup):
    divs = soup.find_all('li', class_='css-0')
    processed_titles = set()  # Keep track of processed job titles
    for item in divs:
        job_url = item.find('a', class_='chakra-button css-1y7j4hn')['href']
        job_url = f"https://www.simplyhired.com{job_url}"  

        # Extract job details and qualifications only for unique job titles
        job_details = extract_job_details(job_url)
        if job_details['title'] not in processed_titles:
            processed_titles.add(job_details['title'])
            joblist.append(job_details)

# Create a connection to the MongoDB database
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["job_database"]
collection = db["jobs"]

# Check if there is only one page or more
c = extract(0)
page_count_element = c.find('div', class_='chakra-text css-5ogf6t')
page_count_text = page_count_element.get_text() if page_count_element else ''
total_pages = int(re.search(r'of (\d+)', page_count_text).group(1)) if page_count_text else 1

# Iterate over pages and transform the data
joblist = []  # Initialize the joblist
for i in range(0, total_pages * 10, 10):
    print(f'Getting page {i}')
    c = extract(i)
    transform(c)

    # Insert job data into MongoDB
    for job in joblist:
        collection.insert_one(job)

print("Data has been stored in the MongoDB database.")