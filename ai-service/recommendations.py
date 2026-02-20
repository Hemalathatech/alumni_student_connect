import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def get_recommendations(student_profile, alumni_list):
    """
    Recommends alumni based on skill similarity and shared interests.
    
    Args:
        student_profile (dict): Student data including 'skills' and 'interests' (if available).
        alumni_list (list): List of alumni dictionaries with 'skills', 'currentRole', 'currentCompany'.
    
    Returns:
        list: Sorted list of alumni with a 'match_score'.
    """
    if not alumni_list:
        return []

    # 1. Prepare Data
    # specific student skills string
    student_skills = " ".join(student_profile.get('skills', []))
    
    # specific alumni skills strings
    alumni_skills = [" ".join(a.get('skills', [])) for a in alumni_list]
    
    # Combine for vectorization
    all_docs = [student_skills] + alumni_skills
    
    # 2. Vectorize (Convert text to numbers)
    count_vectorizer = CountVectorizer(stop_words='english')
    try:
        count_matrix = count_vectorizer.fit_transform(all_docs)
    except ValueError:
        # Handle case with empty vocabulary or stop words only
        return alumni_list 

    # 3. Calculate Cosine Similarity
    # The first vector is the student, the rest are alumni
    cosine_sim = cosine_similarity(count_matrix[0:1], count_matrix[1:])
    
    # 4. Process Results
    sim_scores = cosine_sim[0]
    
    # Add scores to alumni objects
    scored_alumni = []
    for i, score in enumerate(sim_scores):
        alumnus = alumni_list[i].copy() # Shallow copy to avoid mutating original
        alumnus['match_score'] = float(round(score * 100, 2)) # Convert to percentage
        scored_alumni.append(alumnus)
    
    # 5. Sort by score (descending)
    scored_alumni.sort(key=lambda x: x['match_score'], reverse=True)
    
    return scored_alumni

def analyze_gap(student_skills, target_role_skills):
    """
    Simple gap analysis to find missing skills.
    """
    student_set = set(student_skills)
    target_set = set(target_role_skills)
    
    missing_skills = list(target_set - student_set)
    return missing_skills
