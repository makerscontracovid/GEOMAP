function table(arr){
	return arr.map(function(tr){
		return '<tr>' + tr.map(function(td){
			return '<td>'+td+'</td>'
		}).join('') + '</tr>'
	}).join('')
}

function padroniza_telefone(tel){
	var _tel = tel
		.trim()
		.replace(/[-)( ]/g,'')

	if(!(/[0-9]*/.test(_tel))) return tel

	if(_tel.length > 9){
		return _tel.replace(/([0-9]{2})([0-9]{4,5})([0-9]{4})/, function(...results){
			return '(' + results[1] + ') '+ results[2] + '-' + results[3]
		})
	}else{
		return _tel.replace(/([0-9]{4,5})([0-9]{4})/, function(...results){
			return results[1] + '-' + results[2]
		})
	}
}

	// ----------------------- Plota marcador no mapa -----------------------
	function marcador(coords, info, icon, mapa){

		var infowindow = new google.maps.InfoWindow({
			content: info
		});

		var mkOptions = {
			position: coords,
			map: mapa,
		}

		if (icon) mkOptions.icon = icon

		var mk = new google.maps.Marker(mkOptions);

		//Informações do marcador serão exibidas ao passar o cursor por cima
		mk.addListener('mouseover', function() {
			infowindow.open(mapa, mk);
		});

		mk.addListener('mouseout', function() {
			infowindow.close(mapa, mk);
		});

		mk.addListener('click', function() {
			infowindow.open(mapa, mk);
		});
		return mk

	}
	function isString(x) {
		return Object.prototype.toString.call(x) === "[object String]"
	  }


$(function () {

	// ------------------- Tela de carregamento -------------------
	function loading(show){
		if(show==undefined || show == true){
			$('.loader').css('display','block')
		}else{
			$('.loader').css('display','none')
		}
	}

	window.loading = loading
	//loading()

	// ------------------- Configurações iniciais do mapa -------------------

	var center =	{lat: -23.5505762, lng: -46.6932249}	

	map = new google.maps.Map(document.getElementById('mapa'), {
		mapTypeControl:false,
		center: center,
		zoom:11
		//mapTypeId: 'satellite'
	});
	var coordenada = {
		lat: -23.5744016,
		lng: -46.6500734
	}
	
	window.map = map

	//var m1 = marcador(coordenada,'MARCADOR1',false, map)
	var m2 = marcador(center,'Casa de Makers','/img/maker.png', map)

	//window.m1 = m1
	window.m2 = m2

	service = new google.maps.places.PlacesService(map);
	function getPlace(query){
		var request = {
			query: query,
			fields: ['place_id','geometry']
		}
		return new Promise(function(resolve, reject){
			service.textSearch(request, (results, status)=> {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					var coords = results[0].geometry.location.lat()+ ',' + results[0].geometry.location.lng()
					setTimeout(resolve,500,coords);
				}else{
					//alert(status)
					var coords = false
					setTimeout(resolve,500,coords);
				}
			}	);
				
		})
	}
	
	window.getPlace = getPlace;
	
	

	
	// // ------------------- Plota KML das regiões no mapa --------------------
	// var kmlPath = 'https://seusiteaqui.xyz/kmz/nodedokml.kmz' + '?ts='+(new Date().getTime())
	// 	kmlLayer = new google.maps.KmlLayer(kmlPath, {
	// 	preserveViewport: true,
	// 	map: map
	// })

	//Download simultâneo das informações de hospitais, makers, coletas e entregas
	Promise.all([$.get('/hospitais'), $.get('/pedidos')])
	.then(async function(result){
		var hospitais, pedidos
		[hospitais, pedidos] = result
		



		var len= pedidos.length
		console.log(len)

		for(var i = 0; i<len;i++){
			console.log(pedidos[i][0])
			var a = await getPlace(pedidos[i][0])
			console.log(a)

			if(!a){
				console.log('Georreferenciamento não encontrado para ', pedidos[i][0])
				continue;
			}

			var coords= a.split(',').map(parseFloat)
			var hosp_coord = {
				lat: coords[0],
				lng: coords[1]
			}

			var info =	'<div id="content">'+
			'<div id="siteNotice">'+
			'</div>'+
			'<h1 id="bodyContent">'+pedidos[i][0]+'</h1>'+
			'<div id="bodyContent">'+
			'<p><b>Pedido:</b> '+pedidos[i][3]+'</p>'+
			'</div>'+
			'</div>';

			var imgMarcador	= '/img/red.png'
			if(pedidos[i][7] == 'público'){
				imgMarcador = '/img/gray.png'
			}
			if(pedidos[i][7] == 'Privado'){
				imgMarcador = '/img/blue.png'
			}

			if((isString(pedidos[i][9])) && (pedidos[i][9].includes('entregue'))){
				imgMarcador = '/img/hospital-ok.png'
			}

			marcador(hosp_coord,info,imgMarcador, map)		

		}


	})
});