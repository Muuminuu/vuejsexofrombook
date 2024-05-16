import { vi } from 'vitest';
import { shallowMount } from "@vue/test-utils";
import GetLocation from "./GetLocation.vue";

describe("GetLocation", () => {
    it("should render the component without crashing", async (): Promise<void> => 
        { global.navigator.geolocation = {
            getCurrentPosition: () => {},
        };
        const wrapper = await shallowMount(GetLocation);
        expect(wrapper).toBeTruthy();
    });
    
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