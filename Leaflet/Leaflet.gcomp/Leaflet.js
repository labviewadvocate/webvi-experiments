/* eslint-disable no-magic-numbers */
/* global L:false */
(function () {
    'use strict';

    let nextRefnum = 1;
    class RefnumManager {
        constructor () {
            this.refnums = new Map();
        }

        createRefnum (obj) {
            const refnum = nextRefnum;
            nextRefnum += 1;
            this.refnums.set(refnum, obj);
            return refnum;
        }

        getObject (refnum) {
            return this.refnums.get(refnum);
        }

        closeRefnum (refnum) {
            this.refnums.delete(refnum);
        }
    }
    const refnumManager = new RefnumManager();

    const createMap = function (selector) {
        return new Promise(function (resolve) {
            const parents = document.querySelectorAll(selector);
            if (parents.length !== 1) {
                throw new Error(`Expected to find one element with selector ${selector}. Instead found ${parents.length} elements`);
            }

            const parent = parents[0];
            parent.innerHTML = '';

            const element = document.createElement('div');
            element.style = 'width: 100%; height: 100%';
            parent.appendChild(element);
            const austin = L.latLng(30.2672, -97.7431);
            const map = L.map(element).setView(austin, 13);
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                // Must be attributed for OpenStreetMaps, see: https://www.openstreetmap.org/copyright
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
            });

            map.addLayer(tileLayer);
            const refnum = refnumManager.createRefnum(map);
            map.whenReady(function () {
                resolve(refnum);
            });
        });
    };

    const destroyMap = function (refnum) {
        const map = refnumManager.getObject(refnum);
        if (map === undefined) {
            throw new Error('Invalid Leaflet map refnum');
        }
        refnumManager.closeRefnum(refnum);
        map.remove();
    };

    window.WebVILeaflet = {
        createMap,
        destroyMap
    };
}());
