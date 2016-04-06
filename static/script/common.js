var agent = navigator.userAgent.toLowerCase();


if (agent.indexOf("msie") != -1) {

  document.getElementById('fixed_navbar').innerHTML = '<a class="navbar-brand" href="/">UOS AVALON</a><br><br><br><div style="font-size:18pt">&nbsp;&nbsp;&nbsp;<a href="/search">검색</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/register">등록</a></div>';

  alert("인터넷 익스플로러에서는 디자인이 깨질 수 있습니다. 구글 크롬이나 파이어폭스, 사파리 등을 이용해주시면 감사하겠습니다.");


}
