from flask import Flask, request, jsonify
from flask_cors import CORS
import punnett_utils as pu
import os

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:5500", "https://www.evolutionhq.org"], supports_credentials=True)

@app.route('/calculatemono', methods=['POST'])
def calculate_mono_punnett():
    data = request.get_json()
    if not data or 'parent1' not in data or 'parent2' not in data:
        return jsonify({'error': 'Please provide both parent1 and parent2 genotypes'}), 400
    
    parent1 = data['parent1']
    parent2 = data['parent2']
    
    offspring1, offspring2, offspring3, offspring4 = pu.mono_punnett(parent1, parent2)
    
    geno_ratio = pu.mono_genotypic_ratio(offspring1, offspring2, offspring3, offspring4)
    pheno_ratio = pu.mono_phenotypic_ratio(offspring1, offspring2, offspring3, offspring4)
    
    response = {
      'offspring1': offspring1,
      'offspring2': offspring2,
      'offspring3': offspring3,
      'offspring4': offspring4,
      'geno_ratio': geno_ratio,
      'pheno_ratio': pheno_ratio
    }
    
    return jsonify(response), 200

@app.route('/calculatedi', methods=['POST'])
def calculate_di_punnett():
  data = request.get_json()
  if not data or 'parent1' not in data or 'parent2' not in data:
      return jsonify({'error': 'Please provide both parent1 and parent2 genotypes'}), 400
    
  parent1 = data['parent1']
  parent2 = data['parent2']

  offspring_arr = pu.di_punnett(parent1, parent2)
  geno_ratio = pu.di_genotypic_ratio(offspring_arr)
  pheno_ratio = pu.di_phenotypic_ratio(offspring_arr)

  response = {
    'offspring': offspring_arr,
    'geno_ratio': geno_ratio,
    'pheno_ratio': pheno_ratio
  }

  return jsonify(response), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)