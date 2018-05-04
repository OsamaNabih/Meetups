  var FirstDiv = `<div id = "FirstDiv">
   <form id="myForm">
      <div  class = "InputForm" >
         <div class="row equal no-margin">
            <div class="col-sm no-padding">
               <div class = "jumbotron">
                  <h3>Information</h3>
                  <h5 for="exampleInputEmail1">What will the event's name be?</h5>
                  <input class="form-control" id="Name" value="<%=data.EventInformation.meetupName%>" aria-describedby="EventName" placeholder="Name">
                  <h5 for="exampleInputEmail1">What will the event's slogan be?</h5>
                  <input class="form-control"  value="<%=data.EventInformation.slogan%>" id="Slogan" aria-describedby="EventName" placeholder="Slogan">
                  <h5 for="exampleTextarea">Describe your event</h5>
                  <textarea class="form-control"  id="Description" rows="5"><%=data.EventInformation.description%></textarea>
               </div>
            </div>
            <div class= "col-sm no-padding">
               <div class = "jumbotron">
                  <h3>Place</h3>
                  <h5 >Location</h5>
                  <div>
                     <div class = "<%=data.EventInformation.longitude%>/<%=data.EventInformation.latitude%>" id="gmap"></div>
                  </div>
                  <h5 >Venue</h5>
                  <div>
                     <input value="<%=data.EventInformation.venue%>" class="form-control" id="Venue" aria-describedby="EventVenue" placeholder="Venue">
                  </div>
                  <h5 >Capacity</h5>
                  <div>
                     <input class="form-control" value="<%=data.EventInformation.capacity%>" id="Capacity" aria-describedby="EventCapacity" placeholder="Capacity">
                  </div>
                  <h5 >Price</h5>
                  <div>
                     <input class="form-control" value="<%=data.EventInformation.price%>" pattern = "[0-9]{1,10}" id="Price" aria-describedby="EventPrice" placeholder="Price">
                  </div>
               </div>
            </div>
            <div class= "col-sm no-padding">
               <div class = "jumbotron PaddingTop">
                  <h3>Time</h3>
                  <h5 >Date</h5>
                  <div>
                     <input class="form-control" type="date" value="<%=data.EventInformation.meetupDate.toISOString().split('T')[0]%>" id="Date">
                  </div>
                  <h5 >Start Time</h5>
                  <div>
                     <input value="<%=data.EventInformation.startTime%>"  pattern = "([01]?[0-9]|2[0-3]):[0-5][0-9]" class="form-control"  id="Start">
                  </div>
                  <h5 >End Time</h5>
                  <div>
                     <input  value="<%=data.EventInformation.endTime%>" pattern = "([01]?[0-9]|2[0-3]):[0-5][0-9]" class="form-control"  id="End">
                  </div>
                  <button type="button"  id = "NextDiv" onclick='DisplaySecond()' style="margin-top:20px;" class="FormButton btn btn-outline-dark">Next</button>
               </div>
            </div>
         </div>
      </div>
      </div>
   </form>
   </div>`;
    var SecondDiv = `<div id = "SecondDiv">
                      <div class="container">
         <div class = "jumbotron formJumbotron">
            <div class="row">
               <div class="col-sm">
               </div>
               <div class="col-7">
                  <center>
                     <div class= "InputsList">
                     <button type="button" onclick="AddParagraph()" class="FormButton btn btn-outline-dark">Paragraph question</button>
                        <button type="button" onclick= "AddSingle()" class="FormButton btn btn-outline-dark">Single choice question</button>
                        <button type="button" onclick= "AddMultiple()" class="FormButton btn btn-outline-dark">Multiple choice queston</button>
                        <% var Counter = 0 %>
                         <% data.Questions.forEach(function(date){ 
                                 if(date.questionType == 1)
                                     {
                                         %>
                        <div class="QuestionForm input-group">
                           <div class="input-group-prepend">
                              <div class="input-group-text">
                              <% if(date.required == true) { %>
                                 <input class = "CheckBoxes" type="checkbox" aria-label="Checkbox for following text input true" checked>
                                 <% } else { %>
                                  <input class = "CheckBoxes" type="checkbox" aria-label="Checkbox for following text input">
                                  <% } %>
                              </div>
                           </div>
                           <input value ="<%=date.question%>" type="text" class="form-control Questions" aria-label="Text input with checkbox">
                        </div>  
                         <% } else {  %>
                        <div class="QuestionForm input-group">
                           <div class="input-group-prepend">
                              <div class="input-group-text">
                              <% console.log(date.required) %>
                              <% if(date.required == true) { %>
                                 <input class = "CheckBoxes" type="checkbox" aria-label="Checkbox for following text input true" checked>
                                 <% } else { %>
                                  <input class = "CheckBoxes" type="checkbox" aria-label="Checkbox for following text input">
                                  <% } %>
                              </div>
                           </div>
                           <input type="text" value= "<%=date.question%>" placeholder ="Question" class="form-control Questions"  aria-label="Text input with checkbox">
                        </div>
                        <div class="QuestionForm input-group">
                        <input type="text" id="<%=date.questionType%>|<%=Counter%>" value = "<%= date.Answers.join('|')%>" class="Answers form-control" aria-label="Text input with checkbox">
                        </div>
                        <% Counter++; }}) %>             
                        <div id="Controller">
                        </div>
                        <button type="button" onclick="DisplayFirst()" class="FormButton btn btn-outline-dark">Previous</button>
                        <button type="button" onclick="Submit()" class="FormButton btn btn-outline-dark">Submit</button>
   
                  </center>
               </div>
               <div class="col-sm">
               </div>
            </div>
         </div>
      </div>
                     </div>`;
                         var RegularQuestion = `
                      <div class="QuestionForm input-group">
                           <div class="input-group-prepend">
                              <div class="input-group-text">
                                 <input class = "CheckBoxes1" type="checkbox" aria-label="Checkbox for following text input">
                              </div>
                           </div>
                           <input placeholder ="Question" type="text" class="form-control Questions1" aria-label="Text input with checkbox">
                        </div>`
     var ChoiceQuestion = `<div class="QuestionForm input-group">
                           <div class="input-group-prepend">
                              <div class="input-group-text">
                                 <input class = "CheckBoxes1" type="checkbox" aria-label="Checkbox for following text input">
                              </div>
                           </div>
                           <input type="text" placeholder ="Question" class="form-control Questions1"  aria-label="Text input with checkbox">
                        </div>
                        <div class="QuestionForm input-group">
                        <input type="text" placeholder ="Answers seperated by |" class="Answers1 form-control" aria-label="Text input with checkbox">
                        </div>`
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
       $("#OnDisplay").html(FirstDiv);
      initialize(null);
   });
   
       function DisplayFirst(){
         $("#OnDisplay").html(FirstDiv);
   initialize(longandlat);
      Markup = [];
    $("#myForm").find('input').each(
           function(unusedIndex, child) {
               child.value = values[unusedIndex];
           });
           $('#Description').text(values[values.length - 1]);
       }
       function DisplaySecond(){
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
    $("#OnDisplay").html(SecondDiv);
         }
       }
       function AddParagraph()
                {
                  var Pusher ={question:"",questionType:1};
                  Markup.push(Pusher);
                    $('#Controller').append(RegularQuestion);
                }
                function AddSingle()
                {
                 var Pusher ={question:"",Answers:"",questionType:2};
                  Markup.push(Pusher);
                    $('#Controller').append(ChoiceQuestion);
                }
                function AddMultiple()
                {
                  var Pusher ={question:"",Answers:"",questionType:3};
                  Markup.push(Pusher);
                    $('#Controller').append(ChoiceQuestion);
                }
                function Submit()
                {
                  var Counter = 0;
                  var Questions = [];
                  var Required = [];
                  var Answers = [];
                  $('.Questions').each(function(i, obj) {
                        Questions.push($(obj).val());
                        Counter++;
                      });
                  Counter = 0;
                  $('.CheckBoxes').each(function(i, obj) {
                        if ($(obj).is(':checked'))
                        Required.push(true);
                        else
                        Required.push(false);
                        Counter++;
                      });
                  Counter = 0;
                  $('.Answers').each(function(i, obj) {
                      Answers.push([$(obj).val(),$(obj).attr('id')])
                      });
                      console.log(Questions);
                      console.log(Answers);
                      var markupOld = [];
                      var AnswersCounter = 0;
                      for( var i = 0; i <Questions.length;i++){
                      if(Answers[AnswersCounter] !== undefined && i == Answers[AnswersCounter][1].split('|')[1])
                      {
                        console.log(Answers[AnswersCounter][1]);
                        markupOld.push({
                          question:Questions[i],
                          required:Required[i],
                          Answers: Answers[AnswersCounter][0],
                          questionType:Answers[AnswersCounter][1].split('|')[0]
                        })
                        AnswersCounter++;
                      }
                      else
                      {
                        markupOld.push({
                          question:Questions[i],
                          required:Required[i],
                          questionType:1
                        })
                      }
                      }
                      var Counter = 0;
                  $('.Questions1').each(function(i, obj) {
                        Markup[Counter].question = $(obj).val();
                        Counter++;
                      });
                  Counter = 0;
                  $('.CheckBoxes1').each(function(i, obj) {
                        if ($(obj).is(':checked'))
                        Markup[Counter].required = true;
                        else
                         Markup[Counter].required = false;
                        Counter++;
                      });
                  Counter = 0;
                  $('.Answers1').each(function(i, obj) {
                      while(Markup[Counter].Answers == null)
                         Counter++;
                        Markup[Counter].Answers = $(obj).val();
                        Counter++;
                      });
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
                      Markup = markupOld.concat(Markup);
                      DataSent =
                      {
                        Questions: Markup,
                        EventInformation: values,
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
                function Clear()
                {
                  Markup = [];
                  $("#Controller").html("");
                }
   
   