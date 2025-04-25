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

const showAll = () => {
  displayedVariants.value = filteredVariants.value; // Загружаем все оставшиеся варианты
};

loadInitialVariants();
</script>

<template>
  <div>
    <h2>Генетические Варианты</h2>
    <div>
      <label for="significance">Фильтр по значимости:</label>
      <select v-model="selectedSignificance" @change="filterVariants">
        <option value="">Все</option>
        <option v-for="option in significanceOptions" :key="option" :value="option">{{ option }}</option>
      </select>

      <label for="genotype">Фильтр по генотипу:</label>
      <select v-model="selectedGenotype" @change="filterVariants">
        <option value="">Все</option>
        <option v-for="(value, key) in genotypeMapping" :key="key" :value="key">{{ key }}</option>
      </select>

      <label for="variantName">Фильтр по имени варианта:</label>
      <input type="text" v-model="variantNameFilter" @input="filterVariants" placeholder="Имя варианта"/>

      <label for="hgvs">Фильтр по HGVS:</label>
      <input type="text" v-model="hgvsFilter" @input="filterVariants" placeholder="HGVS"/>
    </div>

    <table>
      <thead>
        <tr>
          <th>Имя варианта</th>
          <th>Генотип</th>
          <th>Значимость</th>
          <th>HGVS</th>
          <th>Внешние источники</th>
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
</template>

<style scoped>
table {
  width: 100%;
  border: 15px solid #F2F8F8;
	border-top: 5px solid #F2F8F8;
  border-collapse: collapse;
  table-layout: fixed;
}

th, td {
  padding: 8px;
  word-wrap: break-word;
}

th {
  background: #F2F8F8;
	border: none;
	border-bottom: 5px solid #F2F8F8;
}

td {
  padding: 5px;
	border: none;
	border-bottom: 5px solid #F2F8F8;
}

tbody tr:hover {
  background-color: #f1f1f1;
}

.table-container {
  overflow-x: auto;
  max-width: 100%;
}

.btn {
    background-color: #F2F8F8;
    font-size: 14px;
    padding: 20px 24px;
    border-radius: 4px;
}
</style>