<script lang="ts" setup>
import { ref, computed } from 'vue';
import AppButton from '@/widgets/button/AppButton.vue'
import variantsData from '@/features/data/variants.json';

// Интерфейс для варианта
interface Variant {
  alleleName: string;
  genotype: string;
  significance: string;
  hgvs: Record<string, string>;
  externalSourceEntries: ExternalSourceEntry[];
}
// Интерфейс для внешних источников
interface ExternalSourceEntry {
  maybeAnnotationSourceGeneticVariantIdentifier: string;
  maybeAnnotationSourceGeneticVariantUrl: string;
  annotationSourceName: string;
}

// Массив возможных значений значимости вариантов
const significanceOptions = ['PATHOGENIC', 'LIKELY_PATHOGENIC', 'BENIGN', 'UNDEFINED', 'UNCERTAIN', 'LIKELY_BENIGN'];

// Сопоставление между пользовательскими названиями генотипа и значениями в данных
const genotypeMapping: Record<string, string> = {
  'HETEROZYGOTE': 'HETEROZYGOUS',
  'HOMOZYGOTE': 'HOMOZYGOUS'
};

// Пустые переменные для выбранных значений фильтров
const selectedSignificance = ref<string>('');
const selectedGenotype = ref<string>('');
const variantNameFilter = ref<string>('');
const hgvsFilter = ref<string>('');

// Переменная для хранения списка отображаемых вариантов
const displayedVariants = ref<Variant[]>([]);

// Приводим variantsData к типу Variant[]
const filteredVariants = computed(() => { //создаем перевычисляемое совйство filteredVariants с массивом выбранных значений
  return (variantsData as Variant[]).filter(variant => {
    const matchesSignificance = selectedSignificance.value ? variant.significance === selectedSignificance.value : true;
    const matchesGenotype = selectedGenotype.value ? variant.genotype === genotypeMapping[selectedGenotype.value] : true;
    const matchesVariantName = variantNameFilter.value ? variant.alleleName.toLowerCase().includes(variantNameFilter.value.toLowerCase()) : true;
    const matchesHgvs = hgvsFilter.value ? Object.values(variant.hgvs).some(hgvs => hgvs && hgvs.toLowerCase().includes(hgvsFilter.value.toLowerCase())) : true;

    return matchesSignificance && matchesGenotype && matchesVariantName && matchesHgvs;
  });
});

// Прогрузка первых 10 строк вариантов
const loadInitialVariants = () => {
  displayedVariants.value = filteredVariants.value.slice(0, 10);
};

// Фильтрация при изменении любого из фильтров
const filterVariants = () => {
  loadInitialVariants();
};

// Проверяем, есть ли еще неотображаемые варианты
const showAllVariants = computed(() => {
  return displayedVariants.value.length < filteredVariants.value.length;
});
// Загружаем все оставшиеся варианты
const showAll = () => {
  displayedVariants.value = filteredVariants.value;
};

//Функция для скроллинга вниз
const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};

//Функция для скроллинга вверх
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

loadInitialVariants();
</script>

<template>
  <div>
    <h2>Filter genetic variants <img src="@/app/icons/dna.svg"></h2>
    
    <div class="filter-container">
      <div class="filter-element">
        <label for="variantName">By variant name:</label>
        <input type="text" v-model="variantNameFilter" @input="filterVariants" placeholder="Variant name"/>
      </div>

      <div class="filter-element">
        <label for="genotype">By genotype:</label>
        <select v-model="selectedGenotype" @change="filterVariants">
        <option value="">All</option>
        <option v-for="(value, key) in genotypeMapping" :key="key" :value="key">{{ key }}</option>
        </select>
      </div>

      <div class="filter-element">
        <label for="significance">By significance:</label>
        <select v-model="selectedSignificance" @change="filterVariants">
        <option value="">All</option>
        <option v-for="option in significanceOptions" :key="option" :value="option">{{ option }}</option>
       </select>
      </div>

      <div class="filter-element">
        <label for="hgvs">By HGVS nomenclature:</label>
        <input type="text" v-model="hgvsFilter" @input="filterVariants" placeholder="HGVS"/>
      </div>
    </div>
    <button class="scroll-button scroll-tobottom" @click="scrollToBottom">
      &#8595;
    </button>
    <button class="scroll-button " @click="scrollToTop">
      &#8593;
    </button>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Name variant</th>
            <th>Genotype</th>
            <th>Significance</th>
            <th>HGVS</th>
            <th>External Sources</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="variant in displayedVariants" :key="variant.alleleName">
            <td>{{ variant.alleleName }}</td>
            <td>{{ variant.genotype }}</td>
            <td>{{ variant.significance }}</td>
            <td>
              <span v-for="(hgvsValue, hgvsKey) in variant.hgvs" :key="hgvsKey">
                {{ hgvsKey }}: {{ hgvsValue }}<br />
              </span>
            </td>
            <td>
              <span v-for="source in variant.externalSourceEntries" :key="source.maybeAnnotationSourceGeneticVariantIdentifier">
                <a :href="source.maybeAnnotationSourceGeneticVariantUrl" target="_blank">{{ source.annotationSourceName }}</a><br />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    <AppButton v-if="showAllVariants" @click="showAll" text="Показать все" class="btn"/>
    </div>
  </div>
</template>

<style scoped>
h2 {
  padding: 10px 0px 10px 15px;
  margin: 0px;
  background-color: rgb(170, 207, 212);
  font-weight: 300;
  color: rgb(5, 76, 85);
}
.filter-container {
  display: flex;
  flex-direction: column;
  width: max-content;
  justify-content: space-between;
  gap: 10px;
  padding: 20px;
  border-radius: 8px;
}

.filter-element {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #096b78;
  padding-right: 15px;
}

input[type="text"], select {
  border: 2px solid #aacfd4;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus, select:focus {
  border-color: #096b78;
  outline: none;
}

input::placeholder {
  color: #aaa;
}

select {
  background-color: #fff;
  cursor: pointer;
}

select option {
  padding: 10px;
}

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

.btn {
  background-color: #096b78;
  color: #fff;
  font-size: 14px;
  margin-top: 20px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}
.btn:hover {
  background-color: #0aa0b3;
  transition: all 0.2s;
	box-shadow: 0 7px 14px rgb(65 132 144 / 10%), 0 3px 6px rgb(0 0 0 / 8%)
}
.scroll-tobottom {
  top: 43% !important;
}
.scroll-button {
  position: fixed;
  top: 35%;
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