var getSheets = require('./sheets.js').get

var planilha_hospitais = '1mnQ6EG6nTnmc-vEQAotJhgTuHRDXGQ0Y_hWv7acsXYs'
var tabela = '1wNKK9WG4lcjW1-GBoOTPjtS1zPvglB6Zd21OWFK_cMM'

var I = '!D2:G'

// var planilhas = [
// 	'SP/REGIAO METROPOLITANA'
// ]

module.exports = async (req, res)=>{

	// var respostas = await getSheets(tabela,"'SP/REGIAO METROPOLITANA'!D2:G")
	// res.send(respostas)

	var respostas = await getSheets(planilha_hospitais,"'SP/REGIAO METROPOLITANA'!D2:M")
	res.send(respostas)
	
	// var chain = planilhas.map(function(planilha){
	// 	return getSheets(planilha_hospitais,planilha+I)
	// })

	// var results = await Promise.all(chain)

	// results = results.reduce((acc, val) => acc.concat(val), []);

	// res.send(results);
}