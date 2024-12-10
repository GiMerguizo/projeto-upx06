const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');
const verificarEmpresa = require('../middlewares/verificarEmpresa'); // Importe o middleware


router.post('/registrar', empresaController.criarEmpresa);
router.get('/', empresaController.listarEmpresas);
router.put('/:id', empresaController.editarEmpresa);
router.delete('/:id', empresaController.excluirEmpresa);
router.post('/login', empresaController.loginEmpresa); 


router.post('/gestores', verificarEmpresa, empresaController.cadastrarGestor);
router.post('/estagiarios/atribuir', verificarEmpresa, empresaController.atribuirEstagiario);

module.exports = router;