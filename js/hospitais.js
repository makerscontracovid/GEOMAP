var getSheets = require('./sheets.js').get

var tabela = '1wNKK9WG4lcjW1-GBoOTPjtS1zPvglB6Zd21OWFK_cMM'

module.exports = async (req, res)=>{
	var respostas = await getSheets(tabela,"'tabela'!A:B")
	res.send(respostas)
}