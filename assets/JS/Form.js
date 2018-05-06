function Submitfun()
{
 var dataString = $('#Form1').serializeArray();
 console.log(dataString);
 var AnswersArray = [];
 var idArray = [];
 var typeArray = [];
 $("h3").each(function() {
    idArray.push($(this).attr('id').split('|')[0])
    typeArray.push($(this).attr('id').split('|')[1])
});

 for (var i = 0;i<dataString.length; i++)
 {
   console.log(idArray);
   console.log(typeArray);
    if(dataString[i].name.indexOf('|') == -1)
    {
        if(isNaN(Number(dataString[i].name)))
        {
                    var name = dataString[i].name;
                   var QuestionNumber = $(`input[name="`+ name+ `"]:checked`, '#Form1').attr('id');
                   var AnswerNumber = Number(QuestionNumber.split('|')[1]);
                  var QuestionNumbr = Number(QuestionNumber.split('|')[0]);

                    AnswersArray.push({Question:QuestionNumbr,Answer:AnswerNumber,questionType:typeArray[QuestionNumbr],questionId:idArray[QuestionNumbr]});
                    console.log("QuestionNumber",QuestionNumbr);
                    console.log("AnswerNumber",AnswerNumber);
                    console.log("idArray[QuestionNumber]",idArray[QuestionNumbr]);
                    console.log("typeArray[QuestionNumber]",typeArray[QuestionNumbr]);

        }
        else
        {
            var QuestionNumber = Number(dataString[i].name);
            console.log(dataString[i]);
            AnswersArray.push({Question:QuestionNumber,Answer:String(dataString[i].value),questionType:typeArray[QuestionNumber],questionId:idArray[QuestionNumber]});
            console.log("QuestionNumber",QuestionNumber);
            console.log("AnswerNumber",AnswerNumber);
            console.log("idArray[QuestionNumber]",idArray[QuestionNumber]);
            console.log("typeArray[QuestionNumber]",typeArray[QuestionNumber]);
        }

    }
    else
    {
        var QuestionNumber = Number(dataString[i].name.split('|')[0]);
        var AnswerNumber = Number(dataString[i].name.split('|')[1]);
        AnswersArray.push({Question:QuestionNumber,Answer:AnswerNumber,questionType:typeArray[QuestionNumber],questionId:idArray[QuestionNumber]});
        console.log("QuestionNumber",QuestionNumber);
        console.log("AnswerNumber",AnswerNumber);
        console.log("idArray[QuestionNumber]",idArray[QuestionNumber]);
        console.log("typeArray[QuestionNumber]",typeArray[QuestionNumber]);
    }
 }
 var Result =
{
    Questions: AnswersArray,
    meetupId: $('.mainDivForm').attr('id')
}
console.log(Result);
$.ajax({
                            url: '/meetup/'+Result.meetupId+'/' + $('.SpecialHey').attr('id'), //This is to be /meetup/:id/register OR /meetup/:id/feedback
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(Result),
                            success: function(data)
                            {
                                window.location.href = '/meetup/'+Result.meetupId
                            }
})
}
