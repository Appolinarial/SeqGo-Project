<script lang="ts" setup>
import { onMounted } from 'vue'
import AppButton from '@/shared/button/AppButton.vue'
import Header from '@/shared/header/Header.vue'
import variantsData from './model/variants.json'
import VariantsFilter from '../variantsFilter/VariantsFilter.vue'
import { useVariantFilter, significanceOptions } from '@/features/index'
import type { Variant } from '@/features/index'

// Локальная копия генотипов
const genotypeMapping = {
  HETEROZYGOTE: 'HETEROZYGOUS',
  HOMOZYGOTE: 'HOMOZYGOUS'
}

const typedVariants = variantsData as Variant[]

const {
  selectedSignificance,
  selectedGenotype,
  variantNameFilter,
  hgvsFilter,
  displayedVariants,
  filteredVariants,
  getSignificanceClass,
  loadInitialVariants,
  filterVariants,
  showAllVariants,
  showAll
} = useVariantFilter(typedVariants)

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(loadInitialVariants)
</script>
<template>
  <div>
    <Header text="Genetic variants" />

    <VariantsFilter
      v-model:variantNameFilter="variantNameFilter"
      v-model:selectedGenotype="selectedGenotype"
      v-model:selectedSignificance="selectedSignificance"
      v-model:hgvsFilter="hgvsFilter"
      :filterVariants="filterVariants"
      :significanceOptions="significanceOptions"
      :genotypeMapping="genotypeMapping"
    />

    <button class="scroll-button scroll-tobottom" @click="scrollToBottom">&#8595;</button>
    <button class="scroll-button" @click="scrollToTop">&#8593;</button>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th class="narrow-column">№</th>
            <th>Variant name</th>
            <th>Genotype</th>
            <th>Significance</th>
            <th>HGVS</th>
            <th>External Sources</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(variant, index) in displayedVariants" :key="variant.alleleName">
            <td>{{ index + 1 }}</td>
            <td>{{ variant.alleleName }}</td>
            <td>{{ variant.genotype }}</td>
            <td :class="getSignificanceClass(variant.significance)">
              {{ variant.significance }}
            </td>
            <td>
              <span v-for="(hgvsValue, hgvsKey) in variant.hgvs" :key="hgvsKey">
                {{ hgvsKey }}: {{ hgvsValue }}<br />
              </span>
            </td>
            <td>
              <span
                v-for="source in variant.externalSourceEntries"
                :key="source.maybeAnnotationSourceGeneticVariantIdentifier"
              >
                <a :href="source.maybeAnnotationSourceGeneticVariantUrl" target="_blank">
                  {{ source.annotationSourceName }}
                </a>
                <br />
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <AppButton v-if="showAllVariants" @click="showAll" text="Show all" class="btn" />
    </div>
  </div>
</template>
<style lang="css" scoped>

.table-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px;
}

table {
  width: 80%;
  border: 15px solid #aacfd4;
	border-top: 5px solid #aacfd4;
  border-collapse: collapse;
  table-layout: fixed;
}

thead th{
  font-size: 16px;
  font-weight:600;
  -webkit-text-stroke: 0.5px #b4e6f5;
  color: #064d57;
}

th, td {
  padding: 8px;
  word-wrap: break-word;
  color: #096b78;
}

th {
  background: #aacfd4;
	border: none;
	border-bottom: 5px solid #aacfd4;
  text-align: start;
  font-size: 13px;
}

.narrow-column {
  width: 33px;
}


td {
  padding: 5px;
	border: none;
	border-bottom: 5px solid #F2F8F8;
}

tbody tr {
  background-color: #fff;
}

tbody tr:hover {
  background-color: #eaf2f1;
}

.text-red {
  color: rgb(174, 16, 43);
  text-shadow: 
     2px  2px 5px #e8a9c3,
     2px -2px 5px #e8a9c3,
    -2px  2px 5px #e8a9c3,
    -2px -2px 5px #e8a9c3;
}

.text-green {
  color: rgb(39, 180, 91);
  text-shadow: 
     2px  2px 5px #8befda,
     2px -2px 5px #8befda,
    -2px  2px 5px #8befda,
    -2px -2px 5px #8befda;
}


.btn {
  background-color: #096b78;
  color: #fff;
  font-size: 14px;
  margin-top: 20px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  padding:5px 15px 5px 15px;
}
.btn:hover {
  background-color: #0aa0b3;
  transition: all 0.2s;
	box-shadow: 0 7px 14px rgb(65 132 144 / 10%), 0 3px 6px rgb(0 0 0 / 8%)
}
.scroll-tobottom {
  top: 48% !important;
}
.scroll-button {
  position: fixed;
  top: 40%;
  left: 20px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #096b78;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.scroll-button:hover {
  background-color: #075b61;
}
</style>