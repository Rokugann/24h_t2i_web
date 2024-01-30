<?php

class User
{
	public $id;
	public $name;
	public $surname;
	public $birth_date;
	public $address;
	public $email;
	public $phone;
    
    public function getName()
    {
        return $this->name;
    }

    public function getSurname()
    {
        return $this->surname;
    }

    public function getBirthDate()
    {
        return $this->birth_date;
    }

    public function getAddress()
    {
        return $this->address;
    }

    public function getEmail()
    {
        return $this->email;
    }

    public function getPhone()
    {
        return $this->phone;
    }

    public function setName(string $name)
    {
        $this->name = $name;

        return $this;
    }

    public function setSurname(string $surname)
    {
        $this->surname = $surname;

        return $this;
    }

    public function setBirthDate(string $birth_date)
    {
        $this->birth_date = $birth_date;

        return $this;
    }

    public function setAddress(string $address)
    {
        $this->address = $address;

        return $this;
    }

    public function setEmail(string $email)
    {
        $this->email = $email;

        return $this;
    }

    public function setPhone(string $phone)
    {
        $this->phone = $phone;

        return $this;
    }
}

?>
