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
	    $('#list_boardgame>thead>tr').append('<th>'+ this.listAttr[i]+ '</th>');
	},

	clearList : function () {
	  $('#list_boardgame>tbody').html('');
	},

	addItem : function (item) {

	  $('#list_boardgame>tbody').append(
	      '<tr><td>'  + item.GameIndex
	    + '</td><td>' + avGenre[item.GameGener]
	    + '</td><td>' + item.GameName
	    + '</td><td>' + item.GameOwner
	    + '</td><td>' + item.SubmitDate.substr(0, 10)
	    + '</td><td>' + item.GameMemo
	    + '</td></tr>');

	}
}
