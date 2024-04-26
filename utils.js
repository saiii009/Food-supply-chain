console.log("HELLO")
async function initWeb3(){
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      console.log("etherium")

      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
      console.log("web3")

    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      console.log("local dev")
    }
    web3 = new Web3(App.web3Provider);
    getWalletAddress()
    await initContract();
}

function getWalletAddress(){
  web3.eth.getAccounts((err,acc)=>{
    console.log(acc[0])
    App.address = acc[0]
    return acc
  })
}

async function initContract(){
  $.getJSON('SupplyChain.json', function(data) {
    var SupplyChainArtifact = data;
    console.log(SupplyChainArtifact)
    App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
    App.contracts.SupplyChain.setProvider(App.web3Provider);

    
  });
}


