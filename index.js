const express = require("express");
const app = express();
const connection = require('./database/database')
const perguntasModel = require('./models/Pergunta')
const respostasModel = require('./models/Resposta')


connection.authenticate()
	.then(() => {})
	.catch(err => console.log(err))

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
	extended: true
}))

app.get("/", (req, res) => {
	perguntasModel.findAll({
		raw: true,
		order: [
			['id', 'desc']
		]
	}).then(perguntas => {
		res.render("index", {
			perguntas
		})
	})
});

app.get("/perguntar", (req, res) => {
	res.render("perguntar", {})
});

app.post("/salvarpergunta", (req, res) => {
	const {
		titulo,
		descricao
	} = req.body
	perguntasModel.create({
		titulo: titulo,
		descricao: descricao
	}).then(() => {
		res.redirect('/')
	}).catch(err => console.log(err))

});

app.get('/pergunta/:id', (req, res) => {
	const id = req.params.id
	perguntasModel.findOne({
		where: {
			id: id
		}
	}).then(pergunta => {
		if (pergunta != undefined) {
			respostasModel.findAll({
				where: {
					perguntaId: pergunta.id
				},
				raw: true,
				order: [
					['id', 'desc']
				]
			}).then((respostas) => {
				res.render("pergunta", {
					pergunta,
					respostas
				})
			})
		} else {
			res.redirect('/')
		}
	})
})

app.post("/responder", (req, res) => {
	const {
		corpo,
		id
	} = req.body

	respostasModel.create({
		corpo: corpo,
		perguntaId: id
	}).then((respostas) => {
		res.redirect(`/pergunta/${id}`)
	}).catch(err => console.log(err))

});

app.listen(3000, () => {});