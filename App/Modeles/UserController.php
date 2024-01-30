<?php
	require_once __DIR__."/Classes/User.php";
	require_once __DIR__."/../../Config/DBConnect.php";

	if(isset($_GET['action'])) 
	{
		$action = $_GET['action'];
		// Call the appropriate function based on the action parameter
		if ($action === 'fetchAll') 
		{
			$users = GetAllUsers();
			echo json_encode(["users" => $users]);
		}
		else 
		{
			echo json_encode(["error" => "Invalid action"]);
		}
	}

	if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
		if ($_POST['action'] === 'submitUser') 
		{
			array_pop($_POST);
			$result = SubmitUser($_POST);
			echo json_encode(["result" => $result]);
		}
		else if ($_POST['action'] === 'delete')
		{
			$result = DeleteUser($_POST['id']);
			echo json_encode(["result" => $result]);
		}
		else 
		{
			echo json_encode(["error" => "Invalid action"]);
		}
	}

	function GetAllUsers()
	{
	    try 
	    {
	        $dbh = MyDBConnect();
	        $query = "SELECT * FROM users";
	        $stmt = $dbh->prepare($query);
	        $stmt->execute();
	        $users = $stmt->fetchAll(PDO::FETCH_CLASS, 'User');
	        return $users;
	    } 
	    catch (PDOException $e) 
	    {
	        return ['error' => 'Database error'];
	    }
	}

	function SubmitUser($user)
	{
		$dbh = MyDBConnect();

		$uniqueFields = ['email', 'phone'];

		foreach($uniqueFields as $field) 
		{
			// Check if the unique field exists
			$checkQuery = "SELECT COUNT(*) FROM users WHERE $field = :$field";
			$checkStmt = $dbh->prepare($checkQuery);
			$checkStmt->bindValue(":$field", $user[$field]);
			$checkStmt->execute();

			if($checkStmt->fetchColumn() > 0) 
			{
				return ['type' => 'Unique violation', 'value' => 'The '.$field.' is already taken'];
			}
		}

		$columns = implode(', ', array_keys($user));
		$binders = ':' . implode(', :', array_keys($user));
		$query = "INSERT INTO users ($columns) VALUES ($binders)";
		$statement = $dbh->prepare($query);
		foreach ($user as $column => $value) 
		{
		    $statement->bindValue(":$column", $value);
		}

		try
		{
			$statement->execute();
			return ['type' => 'success', 'value' => $user, 'last_id' => $dbh->lastInsertId()];
		}
		catch(PDOException $error)
		{
			error_log("Error: ".$error->getMessage()."\n", 3, "controllers_debug_log.php");
			return ['type' => 'PDOError', 'value' => $error->getMessage()];
		}
	}

	function DeleteUser($id)
	{
		$dbh = MyDBConnect();
		$query = "DELETE FROM users WHERE id = :id";
		$statement = $dbh->prepare($query);
		$statement->bindParam("id", $id, PDO::PARAM_INT);
		try
		{
			$statement->execute();
			return 'user deleted';
		}
		catch(PDOException $error)
		{
			error_log("Error: ".$error->getMessage()."\n", 3, "controllers_debug_log.php");
			return $error->getMessage();
		}
	}
?>