import sys
import json
import pandas as pd
import os

# Load the CSV file into a DataFrame
csv_filename = os.path.join(os.path.dirname(__file__), "jobs_with_qualifications_developer.csv")
df = pd.read_csv(csv_filename)

# Convert input JSON data from string to a dictionary
if len(sys.argv) > 1:
       company_goals = json.loads(sys.argv[1])
       user_skills = json.loads(sys.argv[2])
        
else:
       company_goals = {}
       user_skills = {}




# Define weightage for each factor
market_weight = 0.5
skills_weight = 0.2
company_goals_weight = 0.3

# Initialize a list to store recommendation scores and details
recommendations = []

# Calculate recommendation scores
for idx, row in df.iterrows():
    title = row['title']
    skills_list = eval(row['skills'])

    # Calculate skills match score
    skills_match_score = sum(1 for skill in user_skills if any(skill in s for s in skills_list)) / len(user_skills)

    # Calculate company goals match score
    company_goals_match_score = sum(1 for goal in company_goals if goal in skills_list) / len(company_goals)

    # Calculate market match score (simplified for demonstration)
    market_match_score = 0.8

    # Calculate overall recommendation score
    overall_score = (
        market_weight * market_match_score +
        skills_weight * skills_match_score +
        company_goals_weight * company_goals_match_score
    )

    # Extract matched skills
    matched_skills = [skill for skill in user_skills if any(skill in s for s in skills_list)]

    recommendations.append({"title": title, "score": overall_score, "matched_skills": matched_skills})

# Sort recommendations based on overall scores
sorted_recommendations = sorted(recommendations, key=lambda x: x["score"], reverse=True)

# Print the top recommendations
print(json.dumps(sorted_recommendations[:2]))  # Print top 5 recommendations
