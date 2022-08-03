pragma solidity ^0.5.6;

/*
  * storage variables *
  Count contract has 2 public storage variables.

  1) count - By default, count's value is 0,
             it could increase or decrease through `plus` or `minus` function.
  2) lastParticipant - lastParticipant is last person's address
                       who sent a transaction(called plus or minus) to Count contract.
  Count contract.

  * functions *
  Count contract has 2 public functions.
  1) plus - increase `count` storage variable by 1. (+1)
  2) minus - decrease `count` storage variable by 1. (-1)
 */

contract Count {
  uint public count = 0; // count 는 uint 로써, 0 으로 초기화 함을 선언
  address public lastParticipant; // 최신 참여자를 확인하기 위함.

  function plus() public { // 외부에서 불러올 수 있도록 public 선언.
    count++;
    lastParticipant = msg.sender; // the address that initiated the current transaction
  }

  function minus() public { // 외부에서 불러올 수 있도록 public 선언.
    count--;
    lastParticipant = msg.sender;
  }
}
