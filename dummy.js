{
  "number_of_shards": 1,
  "analysis": {
      "filter": {
        "filter_stemmer": {
          "type": "stemmer",
          "language": "english"
        },
        "english_stop": {
          "type": "stop",
          "stopwords": "_english_"
        },
        "english_stemmer": {
          "type": "stemmer",
          "language": "english" 
        },
        "english_possessive_stemmer": {
          "type": "stemmer",
          "language": "possessive_english" 
        }
      },
      "analyzer": {
        "english": {
          "tokenizer": "standard",
          "filter": [
            "english_possessive_stemmer",
            "lowercase",
            "english_stop",
            "english_stemmer",
            "filter_stemmer"
          ]
        }
      }
    }
}