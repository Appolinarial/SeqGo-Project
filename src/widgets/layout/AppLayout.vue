<script setup lang="ts">
import { ref } from 'vue';
import VariantsTable from '../variantTable/VariantsTable.vue';
import AppButton from '../button/AppButton.vue';
  
const dropdownOpen = ref(false);
const currentYear = new Date().getFullYear();

const toggleDropdown = () => {
dropdownOpen.value = !dropdownOpen.value;
};
</script>

<template>
    <div class="app-layout">
      <header class="app-header">
        <div class="logo"><img src="https://static.tildacdn.com/tild3938-3062-4639-b837-663237306162/PARSEQ_LAB_vertical_.svg" alt="logo"></div>
        <div class="app-title">Seq&Go Software</div>
        <nav class="nav-links">
          <a>Analyses</a>
          <a>Annotations</a>
          <a>Hotspots</a>
        </nav>
        <div class="btn-container">
            <AppButton class="upload-btn" text="UPLOAD DATA"><img src="@/app/icons/download_icon.svg" alt="download" ></AppButton>
        </div>
        <img src="@/app/icons/vertical-line.png">
        <div class="dropdown-container">
          <div @click="toggleDropdown" class="dropdown-text">
          <p>brother</p>
          <img src="@/app/icons/expand_icon.svg" alt="expand">
          </div>
          <div v-if="dropdownOpen" class="dropdown-menu">
            <a href="#">Account</a>
            <a href="#">Settings</a>
            <a href="#">Information</a>
          </div>
        </div>
      </header>
  
      <main>
        <slot>
            <VariantsTable />
        </slot>
      </main>
  
      <footer class="app-footer">
        &copy; {{ currentYear }} Seq&Go
      </footer>
    </div>
</template>
  
<style scoped>
.app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.app-header {
    display: flex;
    align-items: center;
    height: 1cm;
    background-color: #096b78;
    padding: 0 20px 0 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.logo {
    font-weight: bold;
    width: 40px;
}

.logo img {
    width: 100%;
}

.app-title {
    margin-left: 10px;
    margin-right: 30px;
    color: #fff;
}

.nav-links {
    margin-right: auto;
    display: flex;
}

.nav-links a {
    margin-left: 20px;
    text-decoration: none;
    color: #fff;
}

.nav-links a:hover {
    cursor: pointer;
}

.btn-container {
    width: 100px;
    padding-right: 15px;
}

.upload-btn {
    width: 100%;
    border-radius: 35px;
    background-color: #efefef;
    color:#096b78;
    border: none;
    font-size: 9px;
    font-weight: 600;
    cursor: pointer;
}

.dropdown-container {
    position: relative;
}

.dropdown-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;
    cursor: pointer;
    color: #fff;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dropdown-menu a {
    display: block;
    padding: 10px;
    text-decoration: none;
}

.dropdown-menu a:hover {
    background-color: #f0f0f0;
}

.app-footer {
    margin-top: auto;
    padding: 10px;
    background-color: #f8f9fa;
    text-align: center;
}
</style>