
    var RegularQuestion = `
                      <div class="QuestionForm input-group">
                           <div class="input-group-prepend">
                              <div class="input-group-text">
                                 <input class = "CheckBoxes" type="checkbox" aria-label="Checkbox for following text input">
                              </div>
                           </div>
                           <input placeholder ="Question" type="text" class="form-control Questions" aria-label="Text input with checkbox">
                        </div>`
     var ChoiceQuestion = `<div class="QuestionForm input-group">
                           <div class="input-group-prepend">
                              <div class="input-group-text">
                                 <input class = "CheckBoxes" type="checkbox" aria-label="Checkbox for following text input">
                              </div>
                           </div>
                           <input type="text" placeholder ="Question" class="form-control Questions"  aria-label="Text input with checkbox">
                        </div>
                        <div class="QuestionForm input-group">
                        <input type="text" placeholder ="Answers seperated by |" class="Answers form-control" aria-label="Text input with checkbox">
                        </div>`
                        var Markup = [];
       function AddParagraph()
                {
                  var Pusher ={question:"",questionType:1};
                  Markup.push(Pusher);
                    $('#Controller2').append(RegularQuestion);
                }
                function AddSingle()
                {
                 var Pusher ={question:"",Answers:"",questionType:2};
                  Markup.push(Pusher);
                    $('#Controller2').append(ChoiceQuestion);
                }
                function AddMultiple()
                {
                  var Pusher ={question:"",Answers:"",questionType:3};
                  Markup.push(Pusher);
                    $('#Controller2').append(ChoiceQuestion);
                }
                function Submit()
                {
                  var Counter = 0;
                  $('.Questions').each(function(i, obj) {
                        Markup[Counter].question = $(obj).val();
                        Counter++;
                      });
                  Counter = 0;
                  $('.CheckBoxes').each(function(i, obj) {
                        if ($(obj).is(':checked'))
                        Markup[Counter].required = true;
                        else
                         Markup[Counter].required = false;
                        Counter++;
                      });
                  Counter = 0;
                  $('.Answers').each(function(i, obj) {
                      while(Markup[Counter].Answers == null)
                         Counter++;
                        Markup[Counter].Answers = $(obj).val();
                        Counter++;
                      });
                      var meetupId = $(".formJumbotron").attr('id');
                      DataSent =
                      {
                        Questions: Markup,
                        id: meetupId
                      }
                      console.log(DataSent);
                      $.ajax({
                            url: '/meetup/'+meetupId+'/addFeedback',
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
