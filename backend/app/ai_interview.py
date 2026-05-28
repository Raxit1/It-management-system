def generate_questions(skills):

    questions = []

    skills = skills.lower()

    if "react" in skills:

        questions.extend([

            "Explain React Hooks",

            "What is useEffect?",

            "Difference between state and props?"
        ])

    if "python" in skills:

        questions.extend([

            "Explain OOP concepts",

            "What is FastAPI?",

            "What is JWT authentication?"
        ])

    if "sql" in skills:

        questions.extend([

            "What is normalization?",

            "Explain joins",

            "Difference between SQL and NoSQL?"
        ])

    return questions