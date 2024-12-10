const express = require('express');
const router = express.Router();
const estagiarioController = require('../controllers/estagiarioController');
const verificarAprendiz = require('../middlewares/verificarEstagiario'); 
const verificarUsuario = require('../middlewares/verificarUsuario');

router.post('/registrar', estagiarioController.registrar);
router.get('/listar', estagiarioController.listar_estagiario);
router.delete('/:id', estagiarioController.excluirEstagiario);
router.put('/:id', verificarAprendiz, estagiarioController.editarEstagiario);
router.get('/buscar/:id', estagiarioController.buscarEstagiarioPorId);
router.post('/:id/desvincular', verificarUsuario, estagiarioController.desvincularEstagiario); 


module.exports = router;