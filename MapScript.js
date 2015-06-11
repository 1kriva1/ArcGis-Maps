      var map; //переменная для карты
      var home;  //переменная для кнопки "Возврат к предыдущему экстенту" 
      var baseMapString; //строка которая определяет базовую карту 
      var zoomLayer; //масштаб(zoom) карты
      var templateBuildings; //информационная база для шара "Здания"
      var templateVegetation; //информационная база для шара "Растительность"
      var measurement; // инструмент измерений
      var legend; // легенда
      var scalebar; // линейный масштаб
      var overviewMapDijit; // инструмент осмотра карты 
      var x, y; // координаты центра карты
      require([
        "dojo/dom",
        "esri/Color",
        "dojo/keys",
        "dojo/parser",
        "esri/config",
        "esri/sniff",
        "esri/map",
        "esri/dijit/OverviewMap",
        "esri/dijit/Scalebar",
        "esri/dijit/Legend",
        "esri/dijit/HomeButton",
        "esri/SnappingManager",
        "esri/dijit/Measurement",
        "esri/layers/FeatureLayer",
        "esri/renderers/SimpleRenderer",
        "esri/tasks/GeometryService",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/InfoTemplate",
        "esri/dijit/Scalebar",
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/TitlePane",
        "dijit/form/CheckBox", 
        "dojo/domReady!"
  ], function(
        dom, Color, keys, parser, esriConfig, has, Map, OverviewMap, Scalebar, Legend, HomeButton, SnappingManager, Measurement, FeatureLayer, SimpleRenderer, GeometryService, SimpleLineSymbol, SimpleFillSymbol,InfoTemplate
    ) {
        parser.parse();        
        esriConfig.defaults.io.proxyUrl = "/proxy/";
        esriConfig.defaults.io.alwaysUseProxy = false;
        esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
        baseMapString="topo";
        zoomLayer=12;        
        map = new Map("map", {
          basemap: baseMapString,
          center: [30.61, 50.52],
          zoom: zoomLayer
        });
        overviewMapDijit = new OverviewMap({
          map: map,
          visible: true
        });
        overviewMapDijit.startup();
        scalebar = new Scalebar({
          map: map,          
          scalebarUnit: "dual"
        });
        var eDiv = dojo.create("div", { id: "editH"});   
          dojo.byId('HomeButton').appendChild(eDiv);
        home = new HomeButton({
          map: map
        }, "editH");
        home.startup();   
        // информация которая будет отображаться при нажатии на элементы шара Здания 
        templateBuildings = new InfoTemplate("${Buildings_Address}", "Серія будинку: ${Buildings_Seria}<br> Кількість поверхів: ${Buildings_Floor}\
          <br> Кількість сходів: ${Buildings_Staircase}<br> Кількість квартир: ${Buildings_Apartments}\
          <br> Кількість мешканців: ${Buildings_Occupant}<br> Площа дому: ${Buildings_AreaCover}<br> Площа сходів: ${Buildings_AreaStaircase}\
          <br> Площа підвалу: ${Buildings_AreaTechfloor}<br> Площа квартири: ${Buildings_AreaCellar}");
        // информация которая будет отображаться при нажатии на элементы шара Растительность 
        var buildingsLayer = new FeatureLayer("http://mgis.geonix.com.ua/arcgis/rest/services/test/testgis/MapServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,          
          outFields: ["*"],
          infoTemplate: templateBuildings
        });
        templateVegetation = new InfoTemplate("Рослинність",  "ID: ${ID}<br> Висота: ${HEIGHT}\
          <br> Тип: ${TYPE}<br> Назва (українська): ${NAME_UA}\
          <br> Назва (російська): ${NAME_RUS}<br> Назва (латинська): ${NAME_LAT}<br> Код: ${CODE_TOPO}\
          <br> Рослинність: ${CODE_NAME}<br> Площа: ${SHAPE.STArea()}");
        var vegetationLayer = new FeatureLayer("http://mgis.geonix.com.ua/arcgis/rest/services/test/testgis/MapServer/1", {
          mode: FeatureLayer.MODE_ONDEMAND,          
          outFields: ["*"],
          infoTemplate: templateVegetation
        });        
        map.addLayer(buildingsLayer);
        map.addLayer(vegetationLayer);
        var eDiv = dojo.create("div", { id: "editL"});   
          dojo.byId('legend').appendChild(eDiv);
        legend = new Legend({
          map: map          
        }, "editL");
        legend.startup();        
        var snapManager = map.enableSnapping({
          snapKey: has("mac") ? keys.META : keys.CTRL
        });
        var layerInfos = [{
          layer: buildingsLayer}, {layer: vegetationLayer
        }];
        snapManager.setLayerInfos(layerInfos);
        var eDiv = dojo.create("div", { id: "editM"});   
          dojo.byId('measurementDiv').appendChild(eDiv);
        measurement = new Measurement({
          map: map
        }, "editM");
        measurement.startup();        
      });

    // функция которая определяет центр экстента
    function getCenter(){
      (function(){
          
          require(["esri/geometry/webMercatorUtils"],
            function(w){
              var c=w.webMercatorToGeographic(map.extent.getCenter());
              x=parseFloat(c.x.toFixed(3));
              y=parseFloat(c.y.toFixed(3));
              });
        })();        
         return [x, y];
    }
    
    // функция которая меняет карты и инициализирует все инструменты 
    function InitMaps(mapType){
      zoomLayer=map.getZoom(); 
      home.destroy();      
      measurement.destroy();      
      legend.destroy();      
      scalebar.destroy(); 
      overviewMapDijit.destroy();     
      if(map!==undefined)
      {
        map.destroy();      
      }   
      require(["dojo/dom", "esri/map", "esri/dijit/OverviewMap", "esri/dijit/Scalebar", 
        "esri/dijit/Legend", "esri/dijit/HomeButton", "esri/InfoTemplate", "esri/layers/FeatureLayer", "esri/dijit/Measurement", 
        "esri/geometry/Point", "dojo/domReady!"], 
        function(dom, Map, OverviewMap, Scalebar, Legend, HomeButton, InfoTemplate, FeatureLayer, Measurement, Point) {
        baseMapString = mapType;               
        map = new Map("map", {
          center: getCenter(),
          zoom: zoomLayer,
          basemap: baseMapString
        }); 
        overviewMapDijit = new OverviewMap({
          map: map,
          visible: true
        }); 
        overviewMapDijit.startup();      
        scalebar = new Scalebar({
          map: map,          
          scalebarUnit: "dual"
        });
        var eDiv = dojo.create("div", { id: "editH"});   
          dojo.byId('HomeButton').appendChild(eDiv); 
          home = new HomeButton({
          map: map
        }, "editH");
        home.startup();        
        var buildingsLayer = new FeatureLayer("http://mgis.geonix.com.ua/arcgis/rest/services/test/testgis/MapServer/0", {
          mode: FeatureLayer.MODE_ONDEMAND,          
          outFields: ["*"],
          infoTemplate: templateBuildings
        });        
        var vegetationLayer = new FeatureLayer("http://mgis.geonix.com.ua/arcgis/rest/services/test/testgis/MapServer/1", {
          mode: FeatureLayer.MODE_ONDEMAND,          
          outFields: ["*"],
          infoTemplate: templateVegetation
        });        
        map.addLayer(buildingsLayer);
        map.addLayer(vegetationLayer);
        var eDiv = dojo.create("div", { id: "editL"});   
          dojo.byId('legend').appendChild(eDiv);
        legend = new Legend({
          map: map          
        }, "editL");
        legend.startup();
        var eDiv = dojo.create("div", { id: "editM"});   
          dojo.byId('measurementDiv').appendChild(eDiv);
        measurement = new Measurement({
          map: map
        }, "editM");
        measurement.startup();        
      });
    } 

    // функция которая открывает\скрывает блок на странице      
    function ShowHideElement(id){ 
      if(document.getElementById(id).style.display === "block")
         document.getElementById(id).style.display = "none";
       else
        document.getElementById(id).style.display = "block";                 
    };

    // функция которая позволяет начать редактирование шара и открывает кнопку "Закончить редактирование"
    function Edit(id){
      ShowHideElement(id);
      EditMapLayer();      
    }  

    // информация которая начинает редактирование шара
    function EditMapLayer(){      
      zoomLayer=map.getZoom();
      home.destroy();      
      measurement.destroy();      
      legend.destroy();
      scalebar.destroy();       
      if(map!==undefined)
        {
          map.destroy();
        } 
      var updateFeature;      
      require([
        "esri/map",
        "esri/dijit/OverviewMap",
        "esri/dijit/Scalebar",
        "esri/dijit/Legend",
        "esri/dijit/HomeButton",
        "esri/layers/FeatureLayer",
        "esri/dijit/Measurement",
        "esri/dijit/AttributeInspector",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/config",
        "esri/tasks/query",
        "dojo/query",
        "dojo/parser", 
        "dojo/dom-construct",
        "dijit/form/Button",
        "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!"
      ], function(
        Map, OverviewMap, Scalebar, Legend, HomeButton, FeatureLayer, Measurement, AttributeInspector,
        SimpleLineSymbol, SimpleFillSymbol, Color,
        ArcGISDynamicMapServiceLayer, esriConfig,
        Query,dojoQuery,
        parser, domConstruct, Button
      ) {        
        map = new Map("map", {
          basemap: baseMapString,
          center: getCenter(),
          zoom: zoomLayer
        });        
        scalebar = new Scalebar({
          map: map,          
          scalebarUnit: "dual"
        });
        var eDiv = dojo.create("div", { id: "editH"});   
          dojo.byId('HomeButton').appendChild(eDiv); 
        home = new HomeButton({
          map: map
        }, "editH");
        home.startup();
        map.on("layers-add-result", initSelectToolbar);
        var mapServerLayer = new ArcGISDynamicMapServiceLayer("http://mgis.geonix.com.ua/arcgis/rest/services/test/testgis/MapServer");
        mapServerLayer.setDisableClientCaching(true);
        map.addLayer(mapServerLayer);        
        var editableLayer = new FeatureLayer("http://mgis.geonix.com.ua/arcgis/rest/services/test/testgis/FeatureServer/0", {
          mode: FeatureLayer.MODE_SELECTION,
          outFields: ["*"]          
        });
        var selectionSymbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(
                "solid",
                new Color("yellow"),
                2
            ),
            null
        );
        editableLayer.setSelectionSymbol(selectionSymbol);
        editableLayer.on("edits-complete", function() {
          mapServerLayer.refresh();
        });
        map.addLayers([editableLayer]);
        var eDiv = dojo.create("div", { id: "editL"});   
          dojo.byId('legend').appendChild(eDiv);
        legend = new Legend({
          map: map          
        }, "editL");
        legend.startup();
        var eDiv = dojo.create("div", { id: "editM"});   
          dojo.byId('measurementDiv').appendChild(eDiv);
        measurement = new Measurement({
          map: map
        }, "editM");
        measurement.startup(); 

        // инициализирует таблицу редактирования шара 
        function initSelectToolbar(evt) {
          var editableLayer = evt.layers[0].layer;
          var selectQuery = new Query();
          map.on("click", function(evt) {
            selectQuery.geometry = evt.mapPoint;
            editableLayer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW, function(features) {
              if (features.length > 0) {               
                updateFeature = features[0];
                map.infoWindow.setTitle(features[0].attributes['Buildings_Address']);
                map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
              }
              else {
                map.infoWindow.hide();
              }
            });
          });
          map.infoWindow.on("hide", function() {
            editableLayer.clearSelection();
          });
          var layerInfos = [
            {
              'featureLayer': editableLayer,
              'showAttachments': false,
              'isEditable': true,
              'fieldInfos': [
                {'fieldName': 'Buildings_Seria', 'isEditable': true, 'tooltip': 'Серія', 'label': 'Серія будинку:'},
                {'fieldName': 'Buildings_Floor', 'isEditable': true, 'tooltip': 'Поверхи', 'label': 'Кількість поверхів:'},
                {'fieldName': 'Buildings_Staircase', 'isEditable': true,'tooltip': 'Сходи', 'label': 'Кількість сходів:'},
                {'fieldName': 'Buildings_Apartments', 'isEditable': true,'tooltip': 'Квартири', 'label': 'Кількість квартир:'},
                {'fieldName': 'Buildings_Occupant', 'isEditable': true,'tooltip': 'Мешканці', 'label': 'Кількість мешканців:'},
                {'fieldName': 'Buildings_AreaCover', 'isEditable': true,'tooltip': 'Площа', 'label': 'Площа дому:'},
                {'fieldName': 'Buildings_AreaStaircase', 'isEditable': true, 'tooltip': 'Площа','label': 'Площа сходів:'},
                {'fieldName': 'Buildings_AreaTechfloor', 'isEditable': true,'tooltip': 'Площа', 'label': 'Площа підвалу:'},
                {'fieldName': 'Buildings_AreaCellar', 'isEditable': true,'tooltip': 'Площа', 'label': 'Площа квартири:'}
              ]
            }
          ];
          var attInspector = new AttributeInspector({
            layerInfos: layerInfos
          }, domConstruct.create("div"));          
          var saveButton = new Button({ label: "Зберегти", "class": "saveButton"},domConstruct.create("div"));
          var cancelButton = new Button({ label: "Скасувати", "class": "cancelButton"},domConstruct.create("div"));
          domConstruct.place(saveButton.domNode, attInspector.deleteBtn.domNode, "after");
          domConstruct.place(cancelButton.domNode, attInspector.deleteBtn.domNode, "after");
          saveButton.on("click", function() {
            updateFeature.getLayer().applyEdits(null, [updateFeature], null);
          });
          attInspector.on("attribute-change", function(evt) {             
            updateFeature.attributes[evt.fieldName] = evt.fieldValue;
          });
          attInspector.on("next", function(evt) {
            updateFeature = evt.feature;
            console.log("Next " + updateFeature.attributes.objectid);
          });
          attInspector.on("delete", function(evt) {
            evt.feature.getLayer().applyEdits(null, null, [evt.feature]);
            map.infoWindow.hide();
          });
          map.infoWindow.setContent(attInspector.domNode);
          map.infoWindow.resize(350, 240);
        }
      });
    }
    
    // функция которая прекращает редактирование шара
    function StopEditing(){
      ShowHideElement('buttonStopEdit');
      InitMaps(baseMapString);
    }