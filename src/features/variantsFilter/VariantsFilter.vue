<script setup lang="ts">
const variantNameFilter = defineModel<string>('variantNameFilter');
const selectedGenotype = defineModel<string>('selectedGenotype');
const selectedSignificance = defineModel<string>('selectedSignificance');
const hgvsFilter = defineModel<string>('hgvsFilter');

defineProps<{
  filterVariants: () => void;
  significanceOptions: string[];
  genotypeMapping: Record<string, string>;
}>();
</script>

<template>
  <h3 class="filter-container-header">Filter</h3>
  <div class="filter-container">
    <div class="filter-element">
      <label for="variantName">By variant name:</label>
      <input type="text" v-model="variantNameFilter" @input="filterVariants" placeholder="Variant name" />
    </div>

    <div class="filter-element">
      <label for="genotype">By genotype:</label>
      <select v-model="selectedGenotype" @change="filterVariants">
        <option value="">All</option>
        <option v-for="(genotype, key) in genotypeMapping" :key="key" :value="key">{{ key }}</option>
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
      <input type="text" v-model="hgvsFilter" @input="filterVariants" placeholder="HGVS" />
    </div>
  </div>
</template>
<style lang="css" scoped>
h3 {
  padding: 15px 0 0 20px;
  margin: 0px;
  color: rgb(5, 85, 85);
}
.filter-container {
  display: flex;
  flex-direction: column;
  width: max-content;
  justify-content: space-between;
  gap: 10px;
  padding: 15px 0 20px 20px;
  margin-left: 15px;
  border-top: 1px solid #064d57;
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
  width: 148px;
}

select option {
  padding: 10px;
}
</style>
  