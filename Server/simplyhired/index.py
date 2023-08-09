import cloudscraper
from bs4 import BeautifulSoup
import time
import pandas as pd
import requests
import re
import os.path

def extract(page):
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'}
    url = f'https://www.simplyhired.com/search?q=developer&l=Tunis%2C+AR&pn={page}'
    time.sleep(5)
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.content, 'html.parser')
    return soup

def extract_qualifications_from_description(description):
    qualifications = []

    # Define patterns for common qualifications
    qualification_patterns = [
        r'(bachelor\'?s|master\'?s|ph\.?d\.?|doctorate) degree',
        r'(\d+[\+\-]?) years? of experience',
        r'(\d+[\+\-]?) years? experience',
        r'(\d+[\+\-]?) years? related experience',
        r'experience with [A-Za-z0-9,\- ]+',
        r'expert with [A-Za-z0-9,\- ]+',

    ]

    for pattern in qualification_patterns:
        matches = re.findall(pattern, description, re.IGNORECASE)
        qualifications.extend(matches)

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
            joblist.append(job_details)
            processed_titles.add(job_details['title'])

joblist = []

# Check if there is only one page or more
c = extract(0)
page_count_element = c.find('div', class_='chakra-text css-5ogf6t')
page_count_text = page_count_element.get_text() if page_count_element else ''
total_pages = int(re.search(r'of (\d+)', page_count_text).group(1)) if page_count_text else 1

# Iterate over pages
for i in range(0, total_pages * 10, 10):
    print(f'Getting page {i}')
    c = extract(i)
    transform(c)

job_search = 'developer'  # Change this to your job search query
csv_filename = f'jobs_with_qualifications_{job_search}.csv'

# Append the new data to the existing CSV file or create a new one
if os.path.exists(csv_filename):
    df_existing = pd.read_csv(csv_filename)
    df = pd.concat([df_existing, pd.DataFrame(joblist)])
else:
    df = pd.DataFrame(joblist)

df.to_csv(csv_filename, index=False)
print(df.head())