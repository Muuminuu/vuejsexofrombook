<script setup lang="ts">

// computed est importé de Vue pour créer une propriété calculée.
import { computed } from 'vue';

//Une interface Props est définie pour typer les props attendues par le composant. Ici, une seule prop degrees de type number est attendue, représentant les degrés de la direction du vent.
interface Props {
    degrees: number;
}

//defineProps<Props>() est utilisé pour définir et typer les props du composant selon l'interface Props.
const props = defineProps<Props>();

// windStyle est une propriété calculée qui retourne un objet de style. Cette propriété utilise la valeur de props.degrees pour définir une transformation CSS rotate qui fait pivoter l'élément de la flèche en fonction des degrés spécifiés.
const windStyle = computed(() => ({
    transform: `rotate(${props.degrees}deg)`,
}));

</script>

<template>
    <!--  
    Le template comprend un élément span parent.
    À l'intérieur de ce span parent, il y a deux éléments span :
        Le premier span a un attribut aria-hidden="true" (ce qui signifie qu'il est ignoré par les lecteurs d'écran) et applique le style calculé windStyle pour faire pivoter une flèche vers le bas (⬇) selon la direction du vent.
            data-testid="direction" est utilisé pour faciliter les tests en identifiant cet élément.
            :style="windStyle" applique le style calculé à cet élément.
        Le second span a une classe sr-only, ce qui signifie qu'il est destiné uniquement aux lecteurs d'écran. Il contient un texte décrivant la direction du vent en degrés.
            data-testid="direction-sr" est utilisé pour faciliter les tests en identifiant cet élément.
            {{ degrees }} insère la valeur des degrés dans le texte.
    -->
    <!--
    <span>
        <span aria-hidden="true" data-testid="direction" :style="windStyle">⬇</span>
        <span class="sr-only" data-testid="direction-sr">Wind direction: {{ degrees }} degrees</span>
    </span>
    -->
    <div>
        <div class="sr-only wind" data-testid="direction-sr">Wind direction</div>
        <div class="arrow wind" aria-hidden="true" data-testid="direction" :style="windStyle">&#11015;</div>
    </div>
</template>

<style scoped>
.arrow {
    font-size: 3em;
    align-items: center;
    justify-content: center;
  /* transition: transform 0.3s ease-in-out;
  transform: rotate(93deg); */
    height: 70px; /*for normal size*/
    width:30px; /*for normal size*/
    padding-right: 2px;
    padding-left: 2px;
}

/* Mobile phones (portrait and landscape) */
@media (max-width: 599px) {
    .arrow {
        margin-left: 15%; /* Adjust according to your design */
    }
}

/* Tablets and small desktops */
@media (min-width: 600px) and (max-width: 1023px) {
    .arrow {
        margin-left: 15%; /* Adjust according to your design */
    }
}

/* Medium desktops */
@media (min-width: 1024px) and (max-width: 1439px) {
    .arrow {
        margin-left: 35%; /* Adjust according to your design */
    }
}

/* Large desktops and larger */
@media (min-width: 1440px) {
    .arrow {
        margin-left: 40%; /* This is your original setting */
    }
}

</style>