library(yaml)
library(plumber)
library(tidymodels)

# plumber.R

#* Execute the model
#* 
#* @param gender Your gender, allowed value: F; M
#* @param age Your age, allowed range: 40-100
#* @param hypertension Do you have hypertension? Allowed value: No; Yes
#* @param heart_disease Do you have heart disease? Allowed range: No; Yes
#* @param ever_married Have you ever married? Allowed range: No;Yes
#* @param work_type What kind of work you are doing or have done? Allowed value: Self-employed; Private job; Government job
#* @param Residence_type The type of your residence, allowed range: Rural; Urban
#* @param avg_glucose_level Average glucose level, allowed range: 0-310
#* @param bmi Body mass index, allowed range: 9-73
#* @param smoking_status Smoking, allowed value: Never smoked; Formerly smoked; Currently smokes
#* @get /predict/values

function(gender, age, hypertension, heartDisease, everMarried, currentOccupation, 
         residenceType, glucoseLevel, bmi, smokingStatus) {
  
  # read in the saved workflow object
  workflow <- readRDS("harmonized_valid_data.rds")
  
  # assemble the inputs into a data frame
  newdata <- data.frame(gender = factor(gender), 
                        age = as.numeric(age),
                        hypertension = factor(hypertension),
                        heart_disease = factor(heartDisease),
                        ever_married = factor(everMarried), 
                        work_type = factor(currentOccupation), 
                        Residence_type = factor(residenceType), 
                        avg_glucose_level = as.numeric(glucoseLevel), 
                        bmi = as.numeric(bmi), 
                        smoking_status = factor(smokingStatus)
  )
  
  # predict on the new data - class
  prediction_class <- workflow %>% 
    predict(new_data = newdata,
            type = 'class')
  
  # predict on the new data - probability
  prediction_prob <- workflow %>% 
    predict(new_data = newdata,
            type = 'prob')

  predicted_class <- prediction_class$.pred_class
  prob_class_0 <- round(prediction_prob[1], 3)
  prob_class_1 <- round(prediction_prob[2], 3)
  # report result
if(predicted_class == 0) {
  print(paste("The predicted class is: ", predicted_class, ", which indicates no stroke",
              ". The predicted probability for class 0 (no stroke) is: ", prob_class_0,
              ", and for class 1 (stroke) is: ", prob_class_1, ".", sep = ""))
} else if(predicted_class == 1) {
  print(paste("The predicted class is: ", predicted_class, ", which indicates a stroke",
              ". The predicted probability for class 0 (no stroke) is: ", prob_class_0,
              ", and for class 1 (stroke) is: ", prob_class_1, ".", sep = ""))
} else {
  print("The predicted class is not recognized.")
}
}

