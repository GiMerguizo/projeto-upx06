const express = require('express');
const router = express.Router();
const gestorController = require('../controllers/gestor_controller'); 
const verificarGestor = require('../middlewares/verificarGestor'); // Importe o middleware


router.post('/registrar', gestorController.registrar);
router.get('/listar', gestorController.listarGestores); 
router.delete('/:id', gestorController.excluirGestor);
router.get('/buscar/:id', gestorController.buscarGestorPorId); 
router.put('/editar/:id', gestorController.editarGestor); 

router.get('/perfil', verificarGestor, gestorController.getPerfilGestor);
router.get('/estagiarios', verificarGestor, gestorController.getEstagiarios);

module.exports = router;