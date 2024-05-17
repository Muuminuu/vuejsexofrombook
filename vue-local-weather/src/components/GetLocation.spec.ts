/*
*   Ce code de test couvre trois scénarios principaux pour le composant GetLocation :
*       Le composant se monte sans planter.
*       La géolocalisation fonctionne et retourne des coordonnées.
*       L'utilisateur refuse l'accès à la géolocalisation et un message d'erreur est affiché.
*/

import { vi } from 'vitest';                     // bibliotheque de test
import { shallowMount } from "@vue/test-utils";  //  moçnter des composants de manière isolée
import GetLocation from "./GetLocation.vue";     // composant a tester

/* 
*   describe est une fonction de regrouper des tests liés à un même sujet
*   it pour individual test. Ce test vérifie que le composant peut être rendu sans erreur
*   `global.navigator.geolocation` est mocké(simulacre, simulé) pour s'assurer que la fonctionnalité de géolocalisation est disponible.
*   shallowMount monte le composant GetLocation de manière isolée
*   `expect(wrapper).toBeTruthy() vérifie que le composant a été monté avec succès.
*/

describe("GetLocation", () => {                                                     
    it("should render the component without crashing", async (): Promise<void> => 
        { global.navigator.geolocation = {
            getCurrentPosition: () => {},
        };
        const wrapper = await shallowMount(GetLocation);
        expect(wrapper).toBeTruthy();
    });
    
    /*
    *   Un mock (vi.fn) est créé pour simuler getCurrentPosition, renvoyant une position fixe.
    *   global.navigator.geolocation est configuré pour utiliser ce mock.
    *   Le composant est monté
    *   expect(wrapper.vm.coords).toEqual(...) vérifie que les coordonnées dans l'état du composant correspondent à celles fournies par le mock.
    */
    it("displays when geolocaion resolved successfully", async (): Promise<void> =>
        {
            const mockGeoLocation = vi.fn((successCallback: Function) => {
                const position = {
                    coords: {
                        latitude: 51.5074,
                        longitude: -0.1278
                    },
                };
                successCallback(position);
            });
            global.navigator.geolocation = {
                getcurrentPosition: mockGeoLocation,
            };
            
            const wrapper = await shallowMount<GetLocation>(GetLocation);
            expect(wrapper.vm.coords).toEqual({
                latitude: 51.5074,
                longitude: -0.1278
            });
        });

        /*
        *   Un autre mock est créé pour simuler un refus d'accès à la géolocalisation, appelant la fonction errorCallback avec une erreur.
        *   global.navigator.geolocation est configuré pour utiliser ce mock.
        *   Le composant est monté.
        *   expect(wrapper.vm.geolocationBlockedByUser).toEqual(true) vérifie que l'état geolocationBlockedByUser du composant est défini sur true.
        *   expect(wrapper.html()).toContain("User denied access") vérifie que le message d'erreur est rendu dans le HTML du composant.
        */
        it("displays a message when user denied access", async (): Promise<void> => {
            const mockGeoLocation = vi.fn((successCallback: Function, errorCallback: Function) => {
                const error = new Error("USer, denied geolocation access");
                errorCallback(error);
            });
            global.navigator.geolocation = {
                getcurrentPosition: mockGeoLocation,
            };
            const wrapper = await shallowMount<GetLocation>(GetLocation);
            expect(wrapper.vm.geolocationBlockedByUser).toEqual(true);
            expect(wrapper.html()).toContain("Use denied access");
        });
    });