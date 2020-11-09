import { constants } from "environments/constants";
import { DatePipe } from '@angular/common';

declare var $: any;
declare var google: any;
declare var MarkerClusterer: any;

export class Spiralize {

    /**
     * Carrega todos os pacotes do mapa 
     */
    public spiralPath: google.maps.Polyline = new google.maps.Polyline();
    public spiralPoints: any = [];
    public infoWin: google.maps.InfoWindow = new google.maps.InfoWindow();
    public mCircle: google.maps.Circle = new google.maps.Circle();
    public mMap: any;
    // public packMarker = {
    //     display: true,
    //     position: null,
    //     lat: null,
    //     lng: null,
    //     start: null,
    //     family_code: null,
    //     serial: null,
    //     battery: null,
    //     accuracy: null
    // };
    public clustered: boolean;

    /**
     * Arrays de pontos e markers
     */
    public markers: any[] = [];
    public listOfObjects: any = [];
    public duplicated: any = [];
    public iconsOfduplicated: any[] = [];

    constructor(list: any[], map: any, clustered: boolean = false) {
        this.listOfObjects = list;
        this.mMap = map;
        this.clustered = clustered;
        this.resolveClustering();
    }

    clearState() {
        this.markers.map(elem => {
            elem.setMap(null);
        });

        this.iconsOfduplicated.map(elem => {
            elem.setMap(null);
        });
    }

    /**
     * 
     * @param list 
     * @param map 
     * @param clustered 
     * @param showIcons 
     */
    repaint(list: any[], map: any, clustered: boolean = false, showIcons: boolean = true) {
        //Clearing previous state
        this.clearSpiral();
        this.iconsOfduplicated = [];
        this.duplicated = [];
        this.listOfObjects = [];
        this.markers = [];

        this.listOfObjects = list;
        this.mMap = map;
        this.clustered = clustered;
        this.resolveClustering();

        if (showIcons) {
            this.markers.map(elem => {
                elem.setMap(this.mMap);
            });

            this.iconsOfduplicated.map(elem => {
                elem.setMap(this.mMap);
            });
        }
    }

    resolveClustering() {

        this.normalizeDuplicatedPackages();

        this.configureListeners();

        this.configureSpiral();
    }



    normalizeDuplicatedPackages() {
        let auxDuplicated = [];

        let i = 0;
        let j = 0;
        let l = this.listOfObjects.length;
        // console.log(`plotedPackings: ${JSON.stringify(this.listOfObjects)}`);
        let removeI = false;

        while (i < l) {
            j = i + 1;
            auxDuplicated = [];

            removeI = false;

            while (j < l) {
                // console.log(`i: ${i}, j: ${j}, l: ${l}`);

                if ((this.listOfObjects[i].latitude == this.listOfObjects[j].latitude) &&
                    (this.listOfObjects[i].longitude == this.listOfObjects[j].longitude)) {
                    // console.log(`[i] ${this.listOfObjects[i]},  [j] ${this.listOfObjects[j]}`)
                    // console.log('this.duplicated.length: ' + auxDuplicated.length);

                    removeI = true;

                    if (auxDuplicated.length == 0) {
                        // console.log('.');
                        auxDuplicated.push(this.listOfObjects[i], this.listOfObjects[j]);
                        this.listOfObjects.splice(j, 1);
                        l = this.listOfObjects.length;
                        j--;

                    } else {
                        // console.log('..');
                        auxDuplicated.push(this.listOfObjects[j]);
                        this.listOfObjects.splice(j, 1);
                        l = this.listOfObjects.length;
                        j--;
                    }
                }
                j++;
            }

            if (removeI) {
                this.listOfObjects.splice(i, 1);
                l = this.listOfObjects.length;
                i--;
            }

            if (auxDuplicated.length > 0) this.duplicated.push(auxDuplicated);

            i++;
        }

        // console.log('2. listOfObjects: ' + JSON.stringify(this.listOfObjects));
        // console.log('3. duplicated: ' + JSON.stringify(this.duplicated));
        // console.log('4. auxDuplicated: ' + JSON.stringify(auxDuplicated));
    }

    /**
     * Plot all points, clusterize and set the listeners of click and zoom change
     */
    configureListeners() {

        //console.log('listener this.listOfObjects: ' + this.listOfObjects);
        this.markers = this.listOfObjects.map((location, i) => {
            //console.log(location.last_battery);
            let datePipe = new DatePipe('en');

            let m = new google.maps.Marker({
                family_code: location.family.code,
                serial: location.serial,
                tag: location.tag.code,
                battery: (location.last_battery) ? (location.last_battery.battery.toFixed(2) + '%') : 'Sem registro',
                accuracy: (location.last_position !== null) ? (location.last_position.accuracy + 'm') : 'Sem registro',
                message_date : (location.last_position !== null) ? (location.last_position.date) : 'Sem registro',
                position: location.position,
                icon: this.getPinWithAlert(location.current_state)
            })

            google.maps.event.addListener(m, 'click', (evt) => {
                // console.log('click location:' + JSON.stringify(location));

                this.infoWin.setContent(
                    `<div style="padding: 0px 6px;">
                        <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Emb:</span> ${ m.family_code }</p>
                        <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Ser:</span> ${ m.serial }</p>
                        <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Tag:</span> ${ m.tag }</p>
                        <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Acu:</span> ${ m.accuracy }</p>
                        <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Bat:</span> ${ m.battery }</p>
                        <p style="margin-bottom: 2px;"> <span style="font-weight: 700">D/H:</span> ${ datePipe.transform(m.message_date, 'dd/MM/yy HH:mm:ss', '+00:00') } </p>
                    </div>`);

                this.infoWin.setOptions({maxWidth: 250});
                this.infoWin.open(this.mMap, m);
            });

            //Hover para mostrar o círculo da acurácia
            google.maps.event.addListener(m, "mouseover", (evt) => { 
                 
                this.mCircle = new google.maps.Circle({
                  strokeColor: this.getRadiusWithAlert(location.current_state),
                  strokeOpacity: 0.7,
                  strokeWeight: 1,
                  fillColor: this.getRadiusWithAlert(location.current_state),
                  fillOpacity: 0.2,
                  center: m.position,
                  radius: location.last_position ? location.last_position.accuracy : 0,
                });
  
                this.mCircle.setMap(this.mMap);
              });
  
              //Saída do Hover para ocultar o círculo da acurácia
              google.maps.event.addListener(m, "mouseout", (evt) => {
                this.mCircle.setMap(null);
              });

              
            google.maps.event.addListener(this.mMap, 'zoom_changed', () => {
                //console.log('zoom changed:' + JSON.stringify(this.mMap.getZoom()));
                this.clearSpiral();
            });

            return m;
        });

        // if (this.clustered){
        //     console.log('clustered');

        //     const marker = new MarkerClusterer(this.mMap, this.markers, { 
        //       maxZoom: 14,
        //       imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        //     });
        // }
    }


    /**
     * Resolve the spiral of repeated points
     */
    configureSpiral() {

        /**
         * 1. Do array plotar apenas o primeiro elemento.
         * 2. No clique, calcular a posição dos demais ícones.
         */
        this.iconsOfduplicated = [];
        this.duplicated.map(array => {

            /**
             * Plota UM pino das embalagens duplicadas
             */
            let m = new google.maps.Marker({
                // family_code: location.family.code,
                // serial: location.serial,
                // battery: location.battery ? (location.battery.percentage.toFixed(2) + '%') : 'Sem registro',
                // accuracy: (location.last_position !== null) ? (location.last_position.accuracy + 'm') : 'Sem registro',
                // position: location.position,
                // icon: this.getPinWithAlert(location.current_state)

                packing_code: array[0].family.code,
                serial: array[0].serial,
                position: { lat: array[0].latitude, lng: array[0].longitude },
                icon: { url: 'assets/images/pin_cluster.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) },
                // label: `${array.length}`
            })

            this.iconsOfduplicated.push(m);

            /**
             * Trata o clique do pino duplicado
             */
            google.maps.event.addListener(m, 'click', (evt) => {

                // console.log('entrou no event listener');

                if (this.spiralPath.getMap()) { //Se está exibindo o espiral, remove-o

                    this.clearSpiral();

                } else {  //Se não está exibindo o espiral, exibe-o

                    // console.log('..flightPath');
                    let spiralCoordinates: any = [];

                    var centerX = array[0].latitude;
                    var centerY = array[0].longitude;

                    spiralCoordinates.push({ lat: centerX, lng: centerY });

                    //distância entre as voltas da espiral
                    var radius = 6.5;

                    // distância enter dois pontos plotados
                    var chord = 1;

                    //normalizando as constantes de cada zoom
                    if (this.mMap.getZoom() == 4) { radius = 10.24; chord = 2.4; };
                    if (this.mMap.getZoom() == 5) { radius = 5.12; chord = 1.2; };
                    if (this.mMap.getZoom() == 6) { radius = 2.56; chord = 0.6; };
                    if (this.mMap.getZoom() == 7) { radius = 1.28; chord = 0.3; };
                    if (this.mMap.getZoom() == 8) { radius = 0.64; chord = 0.2; };
                    if (this.mMap.getZoom() == 9) { radius = 0.32; chord = 0.1; };
                    if (this.mMap.getZoom() == 10) { radius = 0.16; chord = 0.05; };
                    if (this.mMap.getZoom() == 11) { radius = 0.08; chord = 0.025; };
                    if (this.mMap.getZoom() == 12) { radius = 0.04; chord = 0.0125; };
                    if (this.mMap.getZoom() == 13) { radius = 0.02; chord = 0.00625; };
                    if (this.mMap.getZoom() == 14) { radius = 0.01; chord = 0.003125; };
                    if (this.mMap.getZoom() == 15) { radius = 0.005; chord = 0.0015625; };
                    if (this.mMap.getZoom() == 16) { radius = 0.0025; chord = 0.00078125; };
                    if (this.mMap.getZoom() == 17) { radius = 0.00125; chord = 0.000390625; };
                    if (this.mMap.getZoom() == 18) { radius = 0.000625; chord = 0.0001953125; };
                    if (this.mMap.getZoom() == 19) { radius = 0.0003125; chord = 0.00009765625; };
                    if (this.mMap.getZoom() == 20) { radius = 0.00015625; chord = 0.000048828125; };
                    if (this.mMap.getZoom() == 21) { radius = 0.000078125; chord = 0.0000244140625; };
                    if (this.mMap.getZoom() == 22) { radius = 0.0000390625; chord = 0.00001220703125; };
                    if (this.mMap.getZoom() == 23) { radius = 0.00001953125; chord = 0.000006103515625; };

                    // # de voltas da espiral
                    var coils = 4;

                    // value of theta corresponding to end of last coil
                    var thetaMax = coils * 2 * Math.PI;

                    // How far to step away from center for each side.
                    var awayStep = radius / thetaMax;

                    var rotation = 100;

                    // For every side, step around and away from center.
                    // start at the angle corresponding to a distance of chord 
                    // away from centre.
                    for (var theta = chord / awayStep, loop = 0; loop < array.length; loop++) {
                        //for (var theta = chord / awayStep; theta <= (chord / away) * array.length; ) {
                        //
                        // How far away from center
                        var away = awayStep * theta;
                        //
                        // How far around the center.
                        var around = theta + rotation;
                        //
                        // Convert 'around' and 'away' to X and Y.
                        var x = centerX + Math.cos(around) * away;
                        var y = centerY + Math.sin(around) * away;

                        // Now that you know it, do it. 
                        spiralCoordinates.push({ lat: x, lng: y });

                        // to a first approximation, the points are on a circle
                        // so the angle between them is chord/radius
                        theta += chord / away;
                        //console.log(`theta: ${theta}. +=${chord / away}`);
                    }

                    /**
                     * Desenhar a espiral
                     */
                    this.spiralPath.setOptions({
                        path: spiralCoordinates,
                        geodesic: true,
                        strokeColor: '#cbb7ed',
                        strokeOpacity: 0.4,
                        strokeWeight: 2,
                        zIndex: 998
                    });
                    this.spiralPath.setMap(this.mMap);

                    /**
                     * Plotar os pontos na espiral
                     */
                    for (let sc = 1; sc <= array.length; sc++) {
                        //console.log(`${array.length} array[sc-1].family_code: ${array[sc - 1].family_code}`);

                        let e = new google.maps.Marker({
                            family_code: array[sc - 1].family.code,
                            serial: array[sc - 1].serial,
                            tag: array[sc - 1].tag.code,
                            position: spiralCoordinates[sc],
                            battery: (array[sc - 1].last_battery) ? (array[sc - 1].last_battery.battery.toFixed(2) + '%') : 'Sem registro',
                            message_date : (array[sc - 1].last_position !== null) ? (array[sc - 1].last_position.date) : 'Sem registro',
                            accuracy: (array[sc - 1].last_position !== null) ? (array[sc - 1].last_position.accuracy + 'm') : 'Sem registro',
                            icon: this.getPinWithAlert(array[sc - 1].status, true),
                            zIndex: 999,
                            map: this.mMap
                        });

                        e.setMap(this.mMap);
                        this.spiralPoints.push(e);

                        /**
                        * Trata o clique do pino duplicado
                        */
                        e.addListener('click', () => {
                            let datePipe = new DatePipe('en');

                            this.infoWin
                                .setContent(`<div style="padding: 0px 6px;">
                                                <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Emb:</span> ${ e.family_code }</p>
                                                <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Ser:</span> ${ e.serial }</p>
                                                <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Tag:</span> ${ e.tag }</p>
                                                <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Acu:</span> ${ e.accuracy }</p>
                                                <p style="margin-bottom: 2px;"> <span style="font-weight: 700">Bat:</span> ${ e.battery }</p>
                                                <p style="margin-bottom: 2px;"> <span style="font-weight: 700">D/H:</span> ${ datePipe.transform(e.message_date, 'dd/MM/yy HH:mm:ss', '+00:00') } </p>
                                            </div>`);

                            this.infoWin.setOptions({ maxWidth: 250 });
                            this.infoWin.open(this.mMap, e);
                        });

                        //Hover para mostrar o círculo da acurácia
                        google.maps.event.addListener(e, "mouseover", (evt) => { 
                            
                            this.mCircle = new google.maps.Circle({
                            strokeColor: this.getRadiusWithAlert(array[sc - 1].status),
                            strokeOpacity: 0.7,
                            strokeWeight: 1,
                            fillColor: this.getRadiusWithAlert(array[sc - 1].status),
                            fillOpacity: 0.2,
                            center: e.position,
                            radius: array[sc - 1].last_position ? array[sc - 1].last_position.accuracy : 0,
                            });
            
                            this.mCircle.setMap(this.mMap);
                        });
            
                        //Saída do Hover para ocultar o círculo da acurácia
                        google.maps.event.addListener(e, "mouseout", (evt) => {
                            this.mCircle.setMap(null);
                        });

                    }
                }
            });

        });

        // if (this.clustered){
        //     console.log('clusterize');

        //     new MarkerClusterer(this.mMap, this.duplicated, {
        //       maxZoom: 14,
        //       imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
        //     });
        // }
    }

    clearSpiral() {
        //removendo o espiral
        this.spiralPath.setMap(null);
        this.spiralPath.setOptions({
            path: []
        });

        //removendo os pontos da espiral
        while (this.spiralPoints.length > 0) {
            this.spiralPoints[0].setMap(null);
            this.spiralPoints.shift();
            // if (this.spiralPoints[0] == undefined) console.log('[0] undefined');
            // else console.log(`this.spiralPoints: ${JSON.stringify(this.spiralPoints[0].packing_code)}, ${JSON.stringify(this.spiralPoints[0].serial)}`);
        }

        //console.log('.this.spiralPoints.length: ' + this.spiralPoints.length);
        // console.log('.flightPath path: ' + JSON.stringify(this.spiralPath.getPath()));
    }

    /**
   * Recupera o pino da embalagem de acordo com seu alerta
   */
    getPinWithAlert(status: any, smallSize: boolean = false) {
        let pin = null;

        switch (status) {
            case constants.ALERTS.ANALISYS:
                pin = { url: 'assets/images/pin_analise.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;

            case constants.ALERTS.ABSENT:
                pin = { url: 'assets/images/pin_ausente.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;

            case constants.ALERTS.INCORRECT_LOCAL:
                pin = { url: 'assets/images/pin_incorreto.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;

            case constants.ALERTS.LATE:
                pin = { url: 'assets/images/pin_atrasado.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;

            case constants.ALERTS.PERMANENCE_TIME:
                pin = { url: 'assets/images/pin_permanencia.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;

            case constants.ALERTS.NO_SIGNAL:
                pin = { url: 'assets/images/pin_sem_sinal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;

            case constants.ALERTS.MISSING:
                pin = { url: 'assets/images/pin_perdido.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;


            case constants.ALERTS.DEVICE_REMOVED:
                pin = { url: 'assets/images/pin_removido.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;
            
            default:
                pin = { url: 'assets/images/pin_normal.png', size: (new google.maps.Size(28, 43)), scaledSize: (new google.maps.Size(28, 43)) }
                break;
        }

        if (smallSize) {
            // console.log('small');
            pin.size = (new google.maps.Size(21, 31));
            pin.scaledSize = (new google.maps.Size(21, 31));
        }

        return pin;
    }

    getRadiusWithAlert(current_state) {
        let pin = "#027f01"; ;
    
        switch (current_state) {
          case constants.ALERTS.ANALISYS:
            pin = "#b3b3b3";
            break;
    
          case constants.ALERTS.ABSENT:
            pin = "#ef5562";
            break;
    
          case constants.ALERTS.INCORRECT_LOCAL:
            pin = "#f77737";
            break;
    
          case constants.ALERTS.LOW_BATTERY:
            pin = "#f8bd37";
            break;
    
          case constants.ALERTS.LATE:
            pin = "#4dc9ff";
            break;
    
          case constants.ALERTS.PERMANENCE_TIME:
            pin = "#4c7bff";
            break;
    
          case constants.ALERTS.NO_SIGNAL:
            pin = "#9ecf99";
            break;
    
          case constants.ALERTS.MISSING:
            pin = "#3a9ca6";
            break;  

        case constants.ALERTS.DEVICE_REMOVED:
            pin = "#A349A4";
            break;
    }
    
        return pin;
      }

    toggleShowPackings(status: any) {

        if (status) {
            // console.log('.');

            //Mostrar embalagens
            this.markers.map(elem => {
                elem.setMap(this.mMap);
            });

            //Mostrar embalagens duplicadas
            this.iconsOfduplicated.map(elem => {
                elem.setMap(this.mMap);
            });


            if (this.clustered) {
                new MarkerClusterer(this.mMap, this.markers, {
                    maxZoom: 14,
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                });

                new MarkerClusterer(this.mMap, this.duplicated, {
                    maxZoom: 14,
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                });
            }

        } else {
            // console.log('..');

            //Esconder embalagens
            this.markers.map(elem => {
                elem.setMap(null);
            });

            //Esconder embalagens duplicadas
            this.iconsOfduplicated.map(elem => {
                elem.setMap(null);
            });
        }
    }
}