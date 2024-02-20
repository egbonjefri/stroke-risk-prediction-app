
# Stroke Risk Prediction App

## Overview

This app was created as a requirement for the AI4PH course: Developing and Deploying Transparent and Reproducible Algorithms for Public Health. It aims to predict the risk of stroke in individuals by analyzing various health metrics and lifestyle factors. Utilizing jQuery for a responsive frontend and a robust backend powered by `tidymodels` and `plumber` in R, it offers an accessible and user-friendly interface for risk assessment.

## Features

- **Risk Prediction**: Users can input their health metrics (e.g., age, hypertension history, heart disease histroy, etc.) to receive a stroke risk assessment.
- **Interactive UI**: The frontend, developed with jQuery, provides an interactive experience, guiding users through the data input process seamlessly.
- **API-Driven Analysis**: The backend is powered by a `plumber` API, which leverages `tidymodels` for predictive modeling, ensuring accurate and reliable risk assessments.

## Getting Started

### Prerequisites

- R (version 4.x.x)
- R packages: `tidymodels`, `plumber`, `dplyr`, `readr`, etc.
- jQuery 

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/egbonjefri/stroke-risk-prediction-app.git
cd stroke-risk-prediction-app
```

2. **Install R dependencies**

Launch R or RStudio and install the required packages:

```R
install.packages(c("tidymodels", "plumber", "dplyr", "yaml"))
```

3. **Set up the Frontend**

Navigate to the frontend directory and install npm packages:

```bash
cd frontend
```

### Running the App

1. **Start the Backend Server**

From the root of the project, run:

```bash
Rscript backend/api.R
```

This command starts the `plumber` API server on the specified port (e.g., 8000).

2. **Launch the Frontend**

Open the `index.html` file in your browser or use a local server to view the frontend.

## Usage

1. **Enter Your Data**: Fill in your health metrics in the provided form on the webpage.
2. **Submit for Prediction**: Click on the predict button to send your data to the backend for analysis.
3. **View Your Risk**: The app will display your stroke risk assessment based on the input data.

## Contact

I welcome contributions to improve the app! Please feel free to fork the repository, make changes, and submit pull requests. For major changes, please open an issue first to discuss what you would like to change. For any queries regarding this project, please contact [Jeffery Osagie](mailto:osagiej3@myumanitoba.ca).




## Acknowledgments

- Data and model inspiration from the AI4PH team.
- Thanks to the `tidymodels` and `plumber` teams for their excellent packages.
