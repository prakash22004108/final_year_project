# Literature Survey: AI in Indian Legal and RTI Systems

This literature survey summarizes significant Indian research contributions (journals, conferences) in AI/legal analytics. The table highlights techniques, domains, advantages, limitations, and future directions.

| S.No. | Research Used | Technique(s) Used | Domain | Advantage(s) | Disadvantage(s) / Features | Future Direction |
|---|---|---|---|---|---|---|
| 1 | Rahul Bharati (2024) – *Predictive Justice in Indian Courts* | Deep Neural Networks, SVM, NLP | Judicial case outcome forecasting | Achieves ~78.5% accuracy predicting case outcomes using 500K+ Indian court cases; integrates socio-legal variables | Requires large datasets; potential bias and interpretability issues | Improve fairness, interpretability, and include hybrid/explainable models |
| 2 | Sugam Sharma et al. (2021) – *eLegPredict: Indian Supreme Court* | ML, Text-based Classification | Supreme Court decision prediction | Prototype predicts verdicts (~76% accuracy) on 3,072 cases | Limited dataset; “black-box” model; lacks explanations | Expand dataset; enhance explainability; extend to diverse case types |
| 3 | Ambrish Srivastav & Shaligram Prajapat (2022) – *Text Similarity for IPC Sections* | Vector Space Model, NLP | IPC section identification from FIRs | Automates matching of FIRs to IPC sections; speeds up legal analysis | Relies on lexical similarity; struggles with paraphrased or complex queries | Use embeddings or supervised ML; integrate more legal context and IPC updates |
| 4 | Souvik Sengupta & Vishwang Dave (2022) – *Applicable Law Section Prediction* | Logistic Regression, Naïve Bayes, Decision Tree, SVM, NLP | Assigning legal sections (Income Tax Act) | Multi-label classification pipeline; F1-score ~0.75 | Limited to Income Tax Act; preprocessing intensive | Extend to other laws; integrate deep learning; expand datasets |
| 5 | R. A. Shaikh et al. (2020) – *Legal Case Outcome Prediction (Murder Cases)* | Random Forest, SVM, Feature Extraction | Murder case outcome prediction | Accuracy 85–92%; identifies key case-specific features | Small dataset (86 cases); binary outcomes only; manual feature extraction | Scale up dataset; include other crime types; automate feature extraction using NLP |
| 6 | Rohini P. Kamdi & Avinash J. Agrawal (2015) – *Closed-domain QA for IPC* | Keyword-based QA, Information Retrieval | IPC & Amendment Laws QA | Domain-specific QA improves answer accuracy | Limited to structured IPC knowledge; cannot handle complex NL queries | Enhance with NLP (entity recognition, semantic parsing); expand KB; hybrid QA models |
| 7 | Olivia Ruhil (2024) – *The Legal Assembly Line: A Critique of AI in Indian Law* | Doctrinal analysis | AI in Indian judicial system | Highlights efficiency in data tasks | Risks overlooking ethics and human judgment in law | Balanced AI-human legal systems; ethical AI research |
| 8 | Malhar Kajale et al. (2024) – *Automated Scheduling of SC Cases Using ML* | ML classification, NLP (NER), Scheduling Algorithm | Supreme Court case scheduling | Automates priority labeling and judge assignment | Relies on cleaned datasets; heuristic features | Integrate richer features; real-time data; extend to lower courts |
| 9 | N. N. Sivaranjani et al. (2021) – *HCNN for SC Appeal Decisions* | Hierarchical CNN | Predicting Supreme Court appeal outcomes | Multi-level CNN outperforms flat CNN/RNN; predicts acceptance/rejection | Resource-intensive; binary predictions; deployment challenges | Predict full verdict outcomes; add interpretability; integrate lower court data |
| 10 | Isha Gupta et al. (2023) – *Topics & Sentiment in SC Judgments* | Topic Modeling (LDA), Sentiment Analysis (VADER) | Indian Supreme Court judgment analysis | Identifies key themes and sentiment trends; descriptive insights | Sentiment on legal text can be misleading; topics may oversimplify | Use contextual embeddings and advanced sentiment models; extend to broader legal corpus |

---

## Summary

These papers demonstrate Indian research efforts in AI-assisted legal analytics, judicial outcome prediction, IPC section identification, and fraud detection. AI techniques such as **ML, NLP, OCR, CNNs, and rule-based systems** have been applied to improve legal decision-making, automate tedious processes, and enhance transparency.

Future research directions include:
- Expanding datasets
- Improving fairness and explainability
- Integrating contextual legal knowledge
- Applying hybrid models combining NLP, ML, and rule-based systems
- Extending methods to additional Indian statutes and public sector domains

---

## Citations & Sources

1. **Predictive Justice in Indian Courts: Machine Learning Approaches to Case Outcome Forecasting** – Dr. Rahul Bharati, SSRN  
   [https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5089255](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5089255)

2. **Legal Case Classification Using Machine Learning with NLP** – ResearchGate  
   [https://www.researchgate.net/publication/378726542_Legal_Case_Classification_Using_Machine_Learning_with_NLP](https://www.researchgate.net/publication/378726542_Legal_Case_Classification_Using_Machine_Learning_with_NLP)

3. **The Legal Assembly Line: A Critique of AI in Indian Law** – ResearchGate  
   [https://www.researchgate.net/publication/386381042_THE_LEGAL_ASSEMBLY_LINE_A_CRITIQUE_OF_AI_IN_INDIAN_LAW](https://www.researchgate.net/publication/386381042_THE_LEGAL_ASSEMBLY_LINE_A_CRITIQUE_OF_AI_IN_INDIAN_LAW)

4. **Predicting the Supreme Court Decision on Appeal Cases Using Hierarchical Convolutional Neural Network** – Bohrium  
   [https://www.bohrium.com/paper-details/predicting-the-supreme-court-decision-on-appeal-cases-using-hierarchical-convolutional-neural-network/812449934472118272-13017](https://www.bohrium.com/paper-details/predicting-the-supreme-court-decision-on-appeal-cases-using-hierarchical-convolutional-neural-network/812449934472118272-13017)

5. **A Two-Staged NLP-based Framework for Assessing the Sentiments on Indian Supreme Court Judgments** – Springer  
   [https://link.springer.com/article/10.1007/s41870-023-01273-z](https://link.springer.com/article/10.1007/s41870-023-01273-z)

6. **Supreme Court Applicable Law Section Prediction & IPC Mapping** – Sirjana  
   [https://sirjana.in/wp-content/uploads/2024/04/6.SRJ23A443.pdf](https://sirjana.in/wp-content/uploads/2024/04/6.SRJ23A443.pdf)

7. **Additional arXiv AI Legal Papers** – [https://arxiv.org/pdf/2110.09251](https://arxiv.org/pdf/2110.09251)

---

**Sources:** papers.ssrn.com | arxiv.org | researchgate.net | sirjana.in | bohrium.com | link.springer.com
