<?php
header('Content-Type: application/json');
echo json_encode(['datetime' => date('Y-m-d H:i:s')]);