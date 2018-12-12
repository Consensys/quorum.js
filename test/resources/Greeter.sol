contract Greeter {
  /* Define variable greeting of the type string */
  string greeting;

  /* This runs when the contract is executed */
  function Greeter(string _greeting) public {
    greeting = _greeting;
  }

  /* Main function */
  function greet() constant returns (string) {
    return greeting;
  }
}
