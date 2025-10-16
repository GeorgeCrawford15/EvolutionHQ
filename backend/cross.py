from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
  return render_template('punnett-square.html')

# monohybrid logic
def mono_punnett(parent1, parent2):
  parent1gamete1 = parent1[0]
  parent1gamete2 = parent1[1]
  parent2gamete1 = parent2[0]
  parent2gamete2 = parent2[1]

  def combine_alleles(alleleX, alleleY):
    if alleleX.isupper():
      offspring = alleleX + alleleY
      return offspring
    elif alleleY.isupper():
      offspring = alleleY + alleleX
      return offspring
    else:
      offspring = alleleX + alleleY
      return offspring

  offspring1 = combine_alleles(parent1gamete1, parent2gamete1)
  offspring2 = combine_alleles(parent1gamete2, parent2gamete1)
  offspring3 = combine_alleles(parent1gamete1, parent2gamete2)
  offspring4 = combine_alleles(parent1gamete2, parent2gamete2)

  return offspring1, offspring2, offspring3, offspring4

def mono_genotypic_ratio(offspring1, offspring2, offspring3, offspring4):
  offspring_arr = [offspring1, offspring2, offspring3, offspring4]
  homozygous_dom = 0
  heterozygous = 0
  homozygous_rec = 0

  for genotype in offspring_arr:
    if genotype[0].isupper() and genotype[1].isupper():
      homozygous_dom += 1
    elif genotype[0].isupper() and genotype[1].islower():
      heterozygous += 1
    elif genotype[0].islower() and genotype[1].islower():
      homozygous_rec += 1

  if 4 in [homozygous_dom, heterozygous, homozygous_rec]:
    geno_ratio = "1"
  elif homozygous_dom == heterozygous or heterozygous == homozygous_rec:
    geno_ratio = "1 : 1"
  else:
   geno_ratio = "1 : 2 : 1"

  return geno_ratio

def mono_phenotypic_ratio(offspring1, offspring2, offspring3, offspring4):
  offspring_arr = [offspring1, offspring2, offspring3, offspring4]

  dominant_traits = 0
  recessive_traits = 0

  for genotype in offspring_arr:
    if genotype[0].isupper():
      dominant_traits += 1
    elif genotype[0].islower():
      recessive_traits += 1

  if 4 in [dominant_traits, recessive_traits]:
    pheno_ratio = "1"
  elif dominant_traits == recessive_traits:
    pheno_ratio = "1 : 1"
  else:
    pheno_ratio = "3 : 1"
  
  return pheno_ratio

@app.route('/calculatemono', methods=['POST'])
def calculate_mono_punnett():
    data = request.get_json()
    if not data or 'parent1' not in data or 'parent2' not in data:
        return jsonify({'error': 'Please provide both parent1 and parent2 genotypes'}), 400
    
    parent1 = data['parent1']
    parent2 = data['parent2']
    
    offspring1, offspring2, offspring3, offspring4 = mono_punnett(parent1, parent2)
    
    geno_ratio = mono_genotypic_ratio(offspring1, offspring2, offspring3, offspring4)
    pheno_ratio = mono_phenotypic_ratio(offspring1, offspring2, offspring3, offspring4)
    
    response = {
      'offspring1': offspring1,
      'offspring2': offspring2,
      'offspring3': offspring3,
      'offspring4': offspring4,
      'geno_ratio': geno_ratio,
      'pheno_ratio': pheno_ratio
    }
    
    return jsonify(response), 200


# dihybrid logic
def di_punnett(parent1, parent2):
  parent1gamete1 = parent1[0] + parent1[2]
  parent1gamete2 = parent1[0] + parent1[3]
  parent1gamete3 = parent1[1] + parent1[2]
  parent1gamete4 = parent1[1] + parent1[3]
  parent2gamete1 = parent2[0] + parent2[2]
  parent2gamete2 = parent2[0] + parent2[3]
  parent2gamete3 = parent2[1] + parent2[2]
  parent2gamete4 = parent2[1] + parent2[3]

  def combine_alleles(gameteX, gameteY):
    if gameteX[0].isupper():
      offspring_gene1 = gameteX[0] + gameteY[0]
    else:
      offspring_gene1 = gameteY[0] + gameteX[0]

    if gameteX[1].isupper():
      offspring_gene2 = gameteX[1] + gameteY[1]
    else:
      offspring_gene2 = gameteY[1] + gameteX[1]

    offspring = offspring_gene1 + offspring_gene2
    return offspring

  offspring_arr = []

  parent1_gametes_arr = [parent1gamete1, parent1gamete2, parent1gamete3, parent1gamete4]
  parent2_gametes_arr = [parent2gamete1, parent2gamete2, parent2gamete3, parent2gamete4]

  for parent2_gamete in parent2_gametes_arr:
    for parent1_gamete in parent1_gametes_arr:
      offspring = combine_alleles(parent1_gamete, parent2_gamete)
      offspring_arr.append(offspring)
  
  return offspring_arr

from math import gcd
from functools import reduce

def simplify_ratio(*numbers):
  GCD = reduce(gcd, numbers)

  simplified_values = []
  for n in numbers:
    simplified = n // GCD
    simplified_values.append(simplified)

  return simplified_values

def di_genotypic_ratio(offspring_arr): # MAKE THIS FUNCTION MORE EFFICIENT WITH LOOPS AND LISTS
  homo_dom1_2 = 0
  homo_dom1_hetero2 = 0
  homo_dom1_homo_rec2 = 0

  hetero1_homo_dom2 = 0
  hetero1_2 = 0
  hetero1_homo_rec2 = 0

  homo_rec1_homo_dom2 = 0
  homo_rec1_hetero2 = 0
  homo_rec1_2 = 0

  for genotype in offspring_arr:
    if genotype[:2].isupper() and genotype[-2:].isupper():
      homo_dom1_2 += 1
    elif genotype[:2].isupper() and genotype[2].isupper() and genotype[3].islower():
      homo_dom1_hetero2 += 1
    elif genotype[:2].isupper() and genotype[-2:].islower():
      homo_dom1_homo_rec2 += 1
    elif genotype[0].isupper() and genotype[1].islower() and genotype[2].isupper() and genotype[3].islower():
      hetero1_2 += 1
    elif genotype[0].isupper() and genotype[1].islower() and genotype[-2:].isupper():
      hetero1_homo_dom2 += 1
    elif genotype[0].isupper() and genotype[1].islower() and genotype[-2:].islower():
      hetero1_homo_rec2 += 1
    elif genotype[:2].islower() and genotype[-2:].isupper():
      homo_rec1_homo_dom2 += 1
    elif genotype[:2].islower() and genotype[2].isupper() and genotype[3].islower():
      homo_rec1_hetero2 += 1
    else:
      homo_rec1_2 += 1

  geno_arr = [
    homo_dom1_2,
    homo_dom1_hetero2,
    homo_dom1_homo_rec2,
    hetero1_homo_dom2,
    hetero1_2,
    hetero1_homo_rec2,
    homo_rec1_homo_dom2,
    homo_rec1_hetero2,
    homo_rec1_2
  ]

  simplified_geno_arr = simplify_ratio(*geno_arr) 

  geno_ratio = ""
  for i in simplified_geno_arr:
    if i >= 1:
      geno_ratio += f" {i} :"
  geno_ratio = geno_ratio[1:]
  geno_ratio = geno_ratio[:-1]

  return geno_ratio


def di_phenotypic_ratio(offspring_arr):
  dom_traits1_2 = 0
  dom_trait1_rec_trait2 = 0
  rec_trait1_dom_trait2 = 0
  rec_traits1_2 = 0

  for genotype in offspring_arr:
    if genotype[0].isupper() and genotype[2].isupper():
      dom_traits1_2 += 1
    elif genotype[0].isupper() and genotype[2].islower():
      dom_trait1_rec_trait2 += 1
    elif genotype[0].islower() and genotype[2].isupper():
      rec_trait1_dom_trait2 += 1
    elif genotype[0].islower() and genotype[2].islower():
      rec_traits1_2 += 1

  pheno_arr = [dom_traits1_2, dom_trait1_rec_trait2, rec_trait1_dom_trait2, rec_traits1_2]
  simplified_pheno_arr = simplify_ratio(*pheno_arr)

  pheno_ratio = ""
  for i in simplified_pheno_arr:
    if i >= 1:
      pheno_ratio += f" {i} :"
  pheno_ratio = pheno_ratio[1:]
  pheno_ratio = pheno_ratio[:-1]
  
  return pheno_ratio



@app.route('/calculateddi', methods=['POST'])
def calculate_di_punnett():
  data = request.get_json()
  if not data or 'parent1' not in data or 'parent2' not in data:
      return jsonify({'error': 'Please provide both parent1 and parent2 genotypes'}), 400
    
  parent1 = data['parent1']
  parent2 = data['parent2']

  offspring_arr = di_punnett(parent1, parent2)
  geno_ratio = di_genotypic_ratio(offspring_arr)
  pheno_ratio = di_phenotypic_ratio(offspring_arr)

  response = {
    'offspring': offspring_arr,
    'geno_ratio': geno_ratio,
    'pheno_ratio': pheno_ratio
  }

  return jsonify(response), 200


if __name__ == '__main__':
  import os
  port = int(os.environ.get('PORT', 5000))
  app.run(debug=True, host='0.0.0.0', port=port)