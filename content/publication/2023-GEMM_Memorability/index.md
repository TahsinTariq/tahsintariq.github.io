---
title: "GEMM: A Graph Embedded Model for Memorability Prediction"
date: 2023-06-18
publishDate:  2023-06-18
authors: ["**Tahsin Tariq Banna**", "Swakshar Deb", "Sejuti Rahman", "Shafin Rahman"]
publication_types: ["1"]
abstract: "The focus of this study is to predict human memorability - a person's ability to remember previously seen images or objects. Although recent works have employed deep learning-based approaches to address the problem, they do not utilize spatial structural information within the images. This work investigates Graph Convolutional Networks (GCNs) and Graph Attention Networks (GATs) to approach the problem. The object-centric features within the images are extracted using deep CNN-based models, which contain the structural information of the image. A generic baseline model is created and improved upon iteratively through structural data by constructing graphs and attention mechanisms on the graph edge connections. The constructed graph nodes represent the objects within the image, and the edge connections between the nodes represent the spatial relation to the objects. These graph embeddings are used to train our proposed Graph Embedded Memorability Model (GEMM), which shows significant improvements from the baseline as the attention improves the edge connections of the graph nodes. The model is then evaluated on the LaMem, SUN memorability, and FIGRIM datasets. Although existing state-of-the-art models perform well on one or two datasets, the proposed model generalizes over all three datasets with a Spearman's rank correlation of 0.71 on LaMem, 0.69 on SUN memorability, and 0.59 on the FIGRIM dataset. This model achieves a new state-of-the-art performance compared to the existing literature."
featured: true
tags:
- Deep learning
- Computer vision
publication: "2023 International Joint Conference on Neural Networks (IJCNN)"
links:
  - icon_pack: fas
    icon: scroll
    name: Paper
    url: 'https://doi.org/10.1109/IJCNN54540.2023.10191500'
  - icon_pack: ai
    icon: open-data
    name: Code
    url: 'https://github.com/TahsinTariq/GEMM'
  - icon_pack: fas
    icon: video
    name: Video
    url: 'https://youtu.be/HjJh5guZLDQ'
---

![gemm_architecture](https://user-images.githubusercontent.com/62146852/232325513-e9de077e-49d3-4ce0-b090-6360054c55ca.png)
<p style="text-align:center"> Figure. The GEMM Architecture </p>