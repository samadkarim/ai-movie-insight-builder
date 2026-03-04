# 🎬 AI Movie Insight Builder

AI Movie Insight Builder is a web application that allows users to search movies using IMDb ID and get detailed insights such as movie information, audience sentiment analysis, visualization charts, and trailer links.

This project demonstrates API integration, data visualization, and modern UI development using Next.js.

---

## 🚀 Features

- 🔍 Search movies using IMDb ID
- 🎬 Fetch movie details from OMDb API
- 📊 Audience sentiment analysis
- 📈 Sentiment visualization using Chart.js
- 🎥 Movie trailer search on YouTube
- ⭐ Dynamic rating color based on IMDb score
- 📉 Sentiment progress bars
- 🎯 Quick search buttons for popular movies
- ⏳ Loading indicator while fetching data

---

## 🛠 Tech Stack

- Next.js
- React
- Tailwind CSS
- Chart.js
- OMDb API

## 🔗 API Used

This project uses the **OMDb API** to fetch movie information such as:

- Movie title
- Poster
- IMDb rating
- Plot summary
- Cast information

API Website:
https://www.omdbapi.com/

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ai-movie-insight-builder.git





## 🔑 API Setup

This project uses the **OMDb API** to fetch movie information.

Follow these steps to use the API:

1. Go to the OMDb website and request a free API key:  
https://www.omdbapi.com/apikey.aspx

2. After getting the API key, open the file:

lib/fetchMovie.js

3. Replace the API key in the following line:

```javascript
const API_KEY = "YOUR_API_KEY";


## 🎯 Example IMDb IDs

You can test the application using these IMDb IDs:

tt0133093 → The Matrix  
tt1375666 → Inception  
tt0816692 → Interstellar  
tt0468569 → The Dark Knight  

## 👨‍💻 Author

**Samad Karim**

- GitHub: https://github.com/samadkarim/ai-movie-insight-builder