<script lang="ts" setup>
/*
*   ref et onMounted sont importés de Vue pour gérer l'état réactif et les hooks du cycle de vie du composant.
*   Ref est un type de Vue qui permet de typer les références réactives.
*   WeatherReport est importé, c'est le composant enfant qui affichera les informations météo.
*   Geolocation est un type TypeScript qui définit la structure des coordonnées géographiques.
*/

import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import WeatherReport from './WeatherReport.vue';

type Geolocation = {
    latitude: number;
    longitude: number;
}

/*
*   coords est une référence réactive qui contiendra les coordonnées géographiques ou undefined si elles ne sont pas encore récupérées.
*   geolocationBlockedByUser est une référence réactive qui indique si l'utilisateur a refusé l'accès à la géolocalisation.
*/

const coords: Ref<Geolocation | undefined>= ref();
const geolocationBlockedByUser: Ref<boolean> = ref(false);

/*
*   getGeolocation est une fonction asynchrone qui utilise l'API de géolocalisation du navigateur.
    navigator.geolocation.getCurrentPosition tente de récupérer la position actuelle de l'utilisateur.
    En cas de succès, les coordonnées sont stockées dans coords.
    En cas d'échec (par exemple, si l'utilisateur refuse l'accès), geolocationBlockedByUser est défini sur true et un message d'erreur est logué.
*/

const getGeolocation = async (): Promise<void> => {
    await navigator.geolocation.getCurrentPosition(
        async (position: { coords: Geolocation}) => {
            coords.value = position.coords;
        },
        (error: { message: string }) => {
            geolocationBlockedByUser.value = true;
            console.error(error.message);
        }
    );
};

/*
*     onMounted est un hook de cycle de vie de Vue qui exécute la fonction passée en argument après que le composant a été monté.
*     getGeolocation est appelée pour tenter de récupérer les coordonnées géographiques dès que le composant est monté.
*/

onMounted(async () => {
    await getGeolocation();
});

</script>

<template>


<!--   Si coords est défini et que geolocationBlockedByUser est false, le composant WeatherReport est affiché, avec les coordonnées passées en prop. --> 
<!-- Si geolocationBlockedByUser est true, un message indiquant que l'utilisateur a refusé l'accès à la géolocalisation est affiché. -->


    <WeatherReport v-if="coords && !geolocationBlockedByUser" :coords="coords"/>
    <div v-if="geolocationBlockedByUser">User denied access</div>
</template>
