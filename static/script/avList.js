/* Custom Function
 * 
 * 2016. 3. 21. Jung Hyeonjin
 */

var avList = {
	listAttr : ["ID", "장르", "이름", "소유자", "등록날짜", "비고"],

	initList : function () {

	  this.clearList();

	  $('#list_boardgame>thead>tr').html('');

	  for (var i=0; i<this.listAttr.length; i++)
	    $('#list_boardgame>thead>tr').append('<th class=th_'+i+'>'+ this.listAttr[i]+ '</th>');
	},

	clearList : function () {
	  $('#list_boardgame>tbody').html('');
	},

	addItem : function (item) {
/*
	  $('#list_boardgame>tbody').append(
	      '<tr><td>'  + item.GameIndex
	    + '</td><td>' + avGenre[item.GameGenre]
	    + '</td><td>' + item.GameName
	    + '</td><td>' + item.GameOwner
	    + '</td><td>' + item.SubmitDate.substr(0, 10)
	    + '</td><td class=td_game_memo>' + item.GameMemo
	    + '</td></tr>');
*/
	  $('#list_boardgame>tbody').append(
	      '<tr><td class="td_0">'  + item.GameIndex
	    + '</td><td class="td_1">' + avGenre[item.GameGenre]
	    + '</td><td class="td_2">' + item.GameName
	    + '</td><td class="td_3">' + item.GameOwner
	    + '</td><td class="td_4">' + item.SubmitDate.substr(0, 10)
	    + '</td><td class="td_5">'
		+ '<a tabindex="0" class="btn btn-xs btn-default" role="button" data-toggle="popover" data-trigger="focus" data-placement=bottom data-content=\"' + item.GameMemo + '\">view</button>'
	    + '</td></tr>');



	}
}
