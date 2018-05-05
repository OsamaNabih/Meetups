function Submitfun()
{
 var dataString = $('#Form1').serializeArray();
 var AnswersArray = [];
  console.log(dataString[0].name.indexOf('|'));
 for (var i = 0;i<dataString.length; i++)
 {
    if(dataString[i].name.indexOf('|') == -1)
    {
        if(isNaN(Number(dataString[i].name)))
        {
                    var name = dataString[i].name;
                   var QuestionNumber = $(`input[name="`+ name+ `"]:checked`, '#Form1').attr('id');
                   var AnswerNumber = Number(QuestionNumber.split('|')[1]);
                  var QuestionNumbr = Number(QuestionNumber.split('|')[0]);
                    AnswersArray.push({Question:QuestionNumbr,Answer:AnswerNumber});

        }
        else
        {
            var QuestionNumber = Number(dataString[i].name);
            console.log(dataString[i]);
            AnswersArray.push({Question:QuestionNumber,Answer:String(dataString[i].value)});
        }
         
    }
    else
    {
        var QuestionNumber = Number(dataString[i].name.split('|')[0]);
        var AnswerNumber = Number(dataString[i].name.split('|')[1]);
        AnswersArray.push({Question:QuestionNumber,Answer:AnswerNumber});
    }
 }
 var Result = 
{
    Questions: AnswersArray,
    meetupId: $('.mainDivForm').attr('id')
}
console.log(Result);
$.ajax({
                            url: '/meetup/'+Result.meetupId+'/register',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(Result),
                            success: function(data)
                            {
                                window.location.href = '/meetup/'+Result.meetupId
                            }
})
}
