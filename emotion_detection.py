import requests

def emotion_detector(text_to_analyze):
    # URL del servicio de Watson NLP
    url = 'https://sn-watson-emotion.labs.skills.network/v1/watson.runtime.nlp.v1/NlpService/EmotionPredict'
    
    # Headers con el ID del modelo correcto para la Task 2
    headers = {"grpc-metadata-mm-model-id": "emotion_aggregated-workflow_lang_en_stock"}
    
    # Estructura del JSON de entrada
    myobj = { "raw_document": { "text": text_to_analyze } }
    
    # Realizar la petición POST
    response = requests.post(url, json = myobj, headers = headers)
    
    # Retornar el atributo 'text' de la respuesta (formato JSON string)
    return response.text