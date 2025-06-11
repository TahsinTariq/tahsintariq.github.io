---
title: "Enhancing Agricultural Automation through Weather Invariant Soil Parameter Prediction Using Machine Learning"
date: 2024-04-15
publishDate:  2024-04-15
authors: ["Monisha Mushtary Uttsha", "A.K.M. Nadimul Haque", "**Tahsin Tariq Banna**", "Shamim Ahmed Deowan", "Md. Ariful Islam", "Hafiz Md. Hasan Babu",]
publication_types: ["2"]
abstract: "Soil parameters are crucial aspects in increasing agricultural production. Even though Bangladesh is heavily dependent on agriculture, little research has been done regarding its automation. And a vital aspect of agricultural automation is predicting soil parameters. Generally, sensors relating to soil parameters are quite expensive and are often done in a controlled environment such as a greenhouse. However, a large scale implementation of such expensive sensors is not very feasible. This work tries to find an inexpensive solution towards predicting soil parameters such as soil moisture and temperature, both of which are crucial to the growth of crops. We focus on finding a robust relation between the above mentioned soil parameters with the nearby weather parameters such as humidity and temperature, irrespective of the weather. We apply different machine learning models like multilayer perceptron (MLP), random forest, etc. to predict the soil parameters, given the humidity and temperature of the surrounding environment. For all the experiments we have used a custom made dataset, which contains around 9000 datapoints of soil moisture & temperature, ambient humidity & temperature. The data has been collected in an uncontrolled agriculture bed via inexpensive sensors. Our results show that XGBoost regressor achieves the best results with an R2 score of 0.93 and 0.99 for soil moisture and soil temperature data respectively. This suggests very high correlation between the weather parameters and soil parameters. The model also portrayed a very low root mean squared error and mean absolute error of 0.037 & 0.015 for soil moisture and 0.001 & 0.0008 for soil temperature. Our results show that it is indeed possible to find the soil parameters from the corresponding weather, which will have great impact on mass agricultural automation."
featured: false
tags:
- Machine Learning
- Agriculture
publication: "Heliyon, Volume 10, Issue 7"
links:
  - icon_pack: fas
    icon: scroll
    name: DOI
    url: 'https://www.sciencedirect.com/science/article/pii/S2405844024046577'
  - icon_pack: ai
    icon: open-data
    name: Code
    url: 'https://github.com/Nadimulhaque0403/Soil_parameter_prediction_dataset'
  - icon_pack: fas
    icon: file
    name: Paper
    url: 'https://www.sciencedirect.com/science/article/pii/S2405844024046577/pdfft?md5=3c63d9c062ddae501ad74537f01fd390&pid=1-s2.0-S2405844024046577-main.pdf'
---