 function SubmitFun()
      {
        var AnswersArray = [];
        var OldAnswers = [];
        var ChangedAnswers = [];
            $('input').each(function() {
              OldAnswers.push($(this).attr('value'));
              AnswersArray.push(
                {
                  verified:$(this).is(':checked'),
                  userId: $(this).attr('id')
                });
               console.log($(this).is(':checked'));
               console.log($(this).attr('value'));
              });
        for( var i = 0; i < AnswersArray.length; i++)
        {
              if(OldAnswers[i] != AnswersArray[i].verified)
              {
                ChangedAnswers.push(AnswersArray[i]);
              }
        }
        var meetId = $('.MainValidate').attr('id');
        var post =
        {
          verifiedUsers: ChangedAnswers,
          meetupId: meetId
        }
        $.ajax({
                            url: '/meetup/'+meetId+'/validate',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(post),
                            success: function(data)
                            {
                                window.location.href = '/meetup/'+meetId
                            },
                            error: function(xhr, textStatus, error)
                            {
                              alert(xhr.responseJSON);
                              alert(xhr.responseText);
                            }
      })
      }
