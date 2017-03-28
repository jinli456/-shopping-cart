window.onload = function () {
	/*处理不能通过classname获取兼容性问题*/
	if (!document.getElementsByClassName) {
		document.getElementsByClassName = function (cls) {
			var ret = [];
			var els = document.getElementsByTagName('*');
			for (var i = 0, len = els.length; i < len; i++) {
				if (els[i].className === cls
					|| els[i].className.indexOf(cls + ' ') >= 0
					|| els[i].className.indexOf(' ' + cls + ' ') >= 0
					|| els[i].className.indexOf(' ' + cls) >= 0) {
					ret.push(els[i]);
				}
			}
			return ret;
		}
	}
	/*元素获取*/
	var cartTable = document.getElementById('ljl_cartTable');
	var tr=$(".ljl_shop");
	console.log(tr)
	var checkInputs = document.getElementsByClassName('check');
	var checkAllInputs = document.getElementsByClassName('ljl_check-all');
	var selectedTotal = document.getElementById('selectedTotal');
	var priceTotal = document.getElementById('priceTotal');
	var selected = document.getElementById('selected');
	var foot = document.getElementById('foot');
	var deleteAll = document.getElementById('deleteAll');

	/*修改*/
	var flag=true;
	$('.ljl_change').on('click','.ljl_gai',function(e){
		if(flag){
			$(this).parent().find('.ljl_size').show();
			$(this).closest('.ljl_shop').find('.ljl_price').css('opacity','0')
			flag=false;

		}else{
			$(this).parent().find('.ljl_size').hide();
			$(this).closest('.ljl_shop').find('.ljl_price').css('opacity','1')
			flag=true;
		}


	})



	$('.ljl_hao').on('click',function(){
		$($(this).siblings()).removeClass('checked');
			$(this).addClass('checked');


	})
	//计算
	function getTotal() {
		var seleted = 0;
		var price = 0;
		var HTMLstr = '';
		for (var i = 0, len = tr.length; i < len; i++) {
			if (tr[i].getElementsByTagName('input')[0].checked) {
				seleted += parseInt(tr[i].getElementsByTagName('input')[1].value);
				price += parseFloat((tr[i].childNodes[9].innerHTML).replace(/[^\d.]/g,''));/*取所有小计求和*/

			}

		}
		selectedTotal.innerHTML = seleted;
		priceTotal.innerHTML = price.toFixed(2);
		console.log(selectedTotal)
		console.log(priceTotal)

		if (seleted == 0) {
			foot.className = 'foot';
		}

	}

	//小计
	function getSubTotal(tr) {
		var tds = tr.children[2];
		var price = parseFloat(tds.children[2].innerHTML.replace(/[^\d.]/g,''));
		var count = parseInt(tr.getElementsByTagName('input')[1].value);
		var SubTotal = parseFloat(price * count);
		tr.children[4].innerHTML = '￥'+SubTotal.toFixed(2);
		/*console.log(tds[4])*/
	}
	for (var i = 0 , len = checkInputs.length; i < len; i++) {
		checkInputs[i].onclick = function () {
			//点击全选
			if (this.className === 'ljl_check-all check') {
				for (var j = 0; j < checkInputs.length; j++) {
					checkInputs[j].checked = this.checked;
				}
			}
			if (this.checked == false) {
				for (var k = 0; k < checkAllInputs.length; k++) {
					checkAllInputs[k].checked = false;
				}
			}
			getTotal();
		}
	}

	//点击店名选中店内商品
	$('.ljl_trade_name .ljl_check_one').on('click',function(){
		$(this).closest('.ljl_shopbox').find('.ljl_shop .ljl_check_one.check').prop('checked',this.checked);
		getTotal();
	})




	//点击商品
	for (var i = 0; i < tr.length; i++) {

		tr[i].onclick = function (e) {
			e = e || window.event;
			var el = e.srcElement;
			var cls = el.className;
			var input = this.getElementsByTagName('input')[1];
			var val = parseInt(input.value);
			var reduce = this.getElementsByTagName('span')[1];
			//数量
			switch (cls) {
				case 'ljl_add':
					input.value = val + 1;
					getSubTotal(this);
					break;
				case 'ljl_reduce':
					if (val > 1) {
						input.value = val - 1;
					}
					getSubTotal(this);
					break;
				case 'ljl_delete':
					var conf = confirm('确定要删除宝贝吗？');
					var shopsmall=$(this).parent();
					if (conf) {
						this.parentNode.removeChild(this);
						if($(shopsmall).find('.ljl_shop').length==0){
							shopsmall.parent().remove();
						}
						/*console.log($(shopsmall).find('.ljl_shop').length)*/


					}
					break;
				default :
					break;
			}
			getTotal();

		}

		tr[i].getElementsByTagName('input')[0].onkeyup = function () {
			var val = parseInt(this.value);
			var tr = this.parentNode.parentNode;
			var reduce = tr.getElementsByTagName('span')[1];
			if (isNaN(val) || val < 1) {
				val = 1;
			}
			this.value = val;
			getSubTotal(tr);
			getTotal();
		}
	}
	/*删除失效*/
	$('.ljl_shixiao .ljl_delete').on('click',function(){
		var conf = confirm('确定要删除失效宝贝吗？');
		var shopsmall=$(this).parent('.ljl_shopsmall');
		if(conf){
			$(this).parent().parent().remove();
			$('.ljl_shopbox_lose').each(function(i,v){
				if(($(this).find('.ljl_shixiao').length)==0){
					$(this).remove();
				}
			});

		}



	})

	/*foot处删除失效*/
	$('.clear').on('click',function(){
		var conf = confirm('确定要删除失效宝贝吗？');
		if(conf){
			$('.ljl_shopbox_lose').remove();


		}

	})
	//foot处的删除
	deleteAll.onclick = function () {
		if (selectedTotal.innerHTML != '0') {
			var conf = confirm('确定删除吗？');
			if (conf) {
				for (var i = 0; i < tr.length; i++) {
					var input = tr[i].getElementsByTagName('input')[0];
					if (input.checked) {
						tr[i].parentNode.removeChild(tr[i]);
						/*i--;*/
					}
				}
				$('.ljl_shopbox').each(function(i,v){
					if(($(this).find('.ljl_shop').length)==0){
						$(this).remove();
					}
				});

				$('.ljl_shopbox_lose').each(function(i,v){
					if(($(this).find('.ljl_check_one.check')[0].checked)){
						$(this).remove();
					}
					console.log($(this).find('.ljl_check_one.check')[0].checked)
				});



			}
		}
	}
//监听滚轮,控制结算
	var flag1=true;
	/*window.onscroll=function(){*/
	window.addEventListener("scroll",function(){
		var stop=document.documentElement.scrollTop||document.body.scrollTop;
		if(stop<=200){
			if(flag1){
				flag1=false;
				$('#foot').css({'position':'fixed','left':'0','right':'0','marign':'auto','bottom':'0'});

			}

		}else{
			if(!flag1){
				flag1=true;
				$('#foot').css({'position':'','left':'','right':'','marign':'','bottom':''});

			}

		}
		/*console.log(stop)*/
	})


	checkAllInputs[0].checked = false;
	checkAllInputs[0].onclick();
}