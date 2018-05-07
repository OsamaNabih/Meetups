   var map;
    markers = [];
    var values = [];
    var Markup = [];
    var longandlat = {};
           function initialize(longandflat = null) {
             var myLatlng;
             if (longandflat == null || longandlat.Lat == null)
             {
                        var LongLat = $('#gmap').attr('class');
                        console.log(LongLat);
                        var Long = Number(LongLat.split('/')[0]);
                        var Lat = Number(LongLat.split('/')[1])
               myLatlng = new google.maps.LatLng(Lat,Long);
               longandlat =
                   {
                     Lat: Lat,
                     Lon: Long
                   };

             }
             else
             myLatlng = new google.maps.LatLng(longandlat.Lat,longandlat.Lon);
               var myOptions = {
                   zoom:7,
                   center: myLatlng,
                   mapTypeId: google.maps.MapTypeId.ROADMAP
               }
               map = new google.maps.Map(document.getElementById("gmap"), myOptions);
               // marker refers to a global variable
               if(longandflat == null)
               {
                 marker = new google.maps.Marker({
                   position: myLatlng,
                   map: map
               });
               }
               else
                 {
                   marker = new google.maps.Marker({
                   position: new google.maps.LatLng(longandlat.Lat,longandlat.Lon),
                   map: map
               });
                 }
   
                     markers.push(marker);
               google.maps.event.addListener(map, "click", function(event) {
                   // get lat/lon of click
                   deleteMarkers();
                   var clickLat = event.latLng.lat();
                   var clickLon = event.latLng.lng();
                   longandlat =
                   {
                     Lat: clickLat,
                     Lon: clickLon
                   };
                   // show in input box
                  console.log(clickLat.toFixed(5));
                  console.log(clickLon.toFixed(5));
   
                     var marker = new google.maps.Marker({
                           position: new google.maps.LatLng(clickLat,clickLon),
                           map: map
                        });
                         markers.push(marker);
               });
   
       }
       function initMap()
       {initialize();}
   function deleteMarkers() {
           clearMarkers();
           markers = [];
         }
         function clearMarkers() {
           setMapOnAll(null);
         }
   function setMapOnAll(map) {
           for (var i = 0; i < markers.length; i++) {
             markers[i].setMap(map);
           }
         }
   
    $(document).ready(function(){
      initialize(null);
   });
                function Submit()
                {
                          values = [];
         var re = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");
         var re2 = new RegExp("[0-9]{1,10}");
         var First = $('#Start').val();
         var Second = $('#End').val()
         var Third = $('#Price').val()
         if((First == "" || re.test(First)) && (Second == "" || re.test(Second)) && (Third == "" || re2.test(Third)))
         {
         $("#myForm").find('input').each(
           function(unusedIndex, child) {
               values.push(child.value);
           });
           values[values.length] = $('#Description').val();
                      values = {
                        meetupName: values[0],
                        slogan: values[1],
                        venue: values[2],
                        capacity: values[3],
                        price: values[4],
                        meetupDate: values[5],
                        startTime: values[6],
                        endTime: values[7],
                        description: values[8],
                        longitude: longandlat.Lon,
                        latitude: longandlat.Lat
                      }
                      DataSent =
                      {
                        EventInformation: values
                      }
                      console.log(DataSent);
                      $.ajax({
                            url: '/meetup/' + $('.AddPageTitle').attr('id') + '/Edit' ,
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(DataSent),
                            success: function(data)
                            {
                                window.location.href = '/meetups'
                            }
                })
                }
                }