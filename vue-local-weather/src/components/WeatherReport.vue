<script lang="ts" setup>

/*
    ref et onMounted sont importés de Vue pour gérer l'état réactif et les hooks de cycle de vie du composant.
    Ref est un type de Vue pour typer les références réactives.
    WindDirection est importé, c'est un composant enfant qui affichera la direction du vent.
*/
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import WindDirection from './WindDirection.vue';


// WeatherData définit la structure des données météorologiques.
type WeatherData = {
    location: {
        localtime: Date;
        name: string;
        region: string;
    };
    current: {
        temp_c: number;
        temp_f: number;
        precip_mm: number;
        condition: {
            text: string;
            icon: string;
        };
        wind_degree: number;
        wind_kph: number;
        wind_mph: number;
    };
};

// Coords définit la structure des coordonnées géographiques.
type Coords = { latitude: number; longitude: number }

// Props définit la structure des props attendues, contenant les coordonnées.
interface Props {
    coords: Coords;
}

// props utilise defineProps pour accéder aux props passées au composant.
const props = defineProps<Props>();

// data est une référence réactive qui contiendra les données météorologiques ou undefined si elles ne sont pas encore récupérées.
const data: Ref<WeatherData | undefined> = ref();

//fetchWeather est une fonction asynchrone qui utilise l'API Weather pour récupérer les données météorologiques basées sur les coordonnées fournies.
const fetchWeather = async (coords: Coords): Promise<WeatherData> => {
    //Les coordonnées sont extraites de l'objet coords et utilisées pour former la requête.
    const { latitude, longitude } = coords;

    // Les données renvoyées par l'API sont analysées et retournées.
    // const q = latitude + "," + longitude; // adam for fix
    const q = `${latitude},${longitude}`;
    const res = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${
            import.meta.env.VITE_APP_WEATHER_API_KEY
        }&q=${q}
        `
        // 45.7670656,4.8300032 // adam for fix
    );
    const data = await res && res.json();
    return data;
};

// formatDate formate une date pour qu'elle soit affichée dans un format lisible.
const formatDate = (dateString: Date): string => {
    //Utilise l'objet Intl.DateTimeFormat pour formater la date selon le style local.
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("default", {
        dateStyle: "long",
        timeStyle: "short"
    }).format(date);
};

// onMounted exécute le code passé en argument une fois que le composant est monté.
onMounted(async () => {
    //Les coordonnées sont extraites des props et utilisées pour appeler fetchWeather.
    const {  latitude, longitude } = props.coords;
    //Les données météorologiques récupérées sont stockées dans data.
    const weatherResponse = await fetchWeather({ latitude, longitude });
    // const weatherResponse = await fetchWeather(45.7670656,4.8300032); // adam for fix
    data.value = weatherResponse;
})


</script>

<template>
    <!--
        Si data est défini et contient des informations météorologiques, un article est affiché avec les informations pertinentes :
        Une image représentant la condition météorologique actuelle.
        La description de la condition météorologique, la température en Celsius, le nom et la région de la localisation, les précipitations en millimètres, la date et l'heure locales, et la vitesse du vent en km/h.
        Le composant WindDirection affiche la direction du vent.
        Si data n'est pas encore disponible, un message "Loading..." est affiché.
    -->
    <div>
        <article
            v-if="data && data.current"
            class="max-w-md w-96 rounded-lg shadow-lg p-4 flex bg-white text-black"
        >
            <div class="basis-1/4 text-left">
                <img :src="data.current.condition.icon" alt="" class="h-16 w-16">
            </div>
            <div class="basis-3/4 text-left">
                <h1 class="text-3xl font-bold" >
                    {{ data.current.condition.text }}
                    <span class="text-2xl block" >{{ data.current.temp_c }} °C</span>
                </h1>
                <p >{{ data.location.name }} {{ data.location.region }}</p>
                <p class="precipation">Precipitation: {{ data.current.precip_mm }}mm</p>
                <p data-testid="localtime">{{ formatDate(data.location.localtime) }}</p>
                <p class="windspeed">
                    Wind speed: {{ data.current.wind_kph }} kph
                    <WindDirection :degrees="data.current.wind_degree" />
                </p>
            </div>
        </article>
        <div v-else>Loading...</div>
    </div>
</template>
