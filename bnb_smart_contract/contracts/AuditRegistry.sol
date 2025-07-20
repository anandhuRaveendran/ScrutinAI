// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;


import "@openzeppelin/contracts/access/Ownable.sol";


contract AuditRegistry is Ownable {
    
    struct AuditRecord {
        string contractName;     // Name/identifier of audited contract
        uint8 riskScore;         // Score from 0 to 10
        uint256 timestamp;       // When the audit was saved
        address auditor;         // Who performed the audit
        string ipfsHash;         // IPFS hash of detailed audit report
        bool exists;             // Tracks if the audit exists
    }


    // Events
    event AuditSaved(
        string indexed contractName,
        uint8 riskScore,
        address indexed auditor,
        uint256 timestamp,
        string ipfsHash
    );
    
    event AuditUpdated(
        string indexed contractName,
        uint8 oldScore,
        uint8 newScore,
        address indexed auditor,
        string newIpfsHash
    );
    
    // Mappings and state variables
    mapping(string => AuditRecord) public audits;
    mapping(address => bool) public authorizedAuditors;
    
    string[] public auditedContractNames;
    uint256 public totalAudits;


    // Modifier for authorized auditors
    modifier onlyAuditor() {
        require(
            authorizedAuditors[msg.sender] || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }


    // Constructor
    constructor() Ownable(msg.sender) {
        authorizedAuditors[msg.sender] = true;
    }


    // Owner-only functions
    function addAuditor(address _auditor) external onlyOwner {
        require(_auditor != address(0), "Invalid address");
        authorizedAuditors[_auditor] = true;
    }


    function removeAuditor(address _auditor) external onlyOwner {
        authorizedAuditors[_auditor] = false;
    }


    /**
     * @dev Save or update an audit result
     * @param _contractName Name of the audited contract
     * @param _riskScore Risk score (0–10)
     * @param _ipfsHash IPFS hash pointing to full audit report
     */
    function saveAudit(
        string memory _contractName,
        uint8 _riskScore,
        string memory _ipfsHash
    ) external onlyAuditor {
        require(bytes(_contractName).length > 0, "Contract name required");
        require(_riskScore <= 10, "Score must between 0 and 10");
        require(bytes(_ipfsHash).length > 0, "IPFS hash required");


        bool isNewAudit = !audits[_contractName].exists;
        uint8 oldScore = audits[_contractName].riskScore;


        // Save or update the audit
        audits[_contractName] = AuditRecord({
            contractName: _contractName,
            riskScore: _riskScore,
            timestamp: block.timestamp,
            auditor: msg.sender,
            ipfsHash: _ipfsHash,
            exists: true
        });


        if (isNewAudit) {
            auditedContractNames.push(_contractName);
            totalAudits++;
            emit AuditSaved(
                _contractName,
                _riskScore,
                msg.sender,
                block.timestamp,
                _ipfsHash
            );
        } else {
            emit AuditUpdated(
                _contractName,
                oldScore,
                _riskScore,
                msg.sender,
                _ipfsHash
            );
        }
    }


    /**
     * @notice Get audit details
     */
    function getAudit(string memory _contractName)
        external
        view
        returns (
            uint8 riskScore,
            uint256 timestamp,
            address auditor,
            string memory ipfsHash,
            bool exists
        )
    {
        AuditRecord memory audit = audits[_contractName];
        return (
            audit.riskScore,
            audit.timestamp,
            audit.auditor,
            audit.ipfsHash,
            audit.exists
        );
    }


    /**
     * @notice Check if audit exists
     */
    function isAudited(string memory _contractName)
        external
        view
        returns (bool)
    {
        return audits[_contractName].exists;
    }


    /**
     * @notice Get risk score only
     */
    function getRiskScore(string memory _contractName)
        external
        view
        returns (uint8)
    {
        require(audits[_contractName].exists, "Audit not found");
        return audits[_contractName].riskScore;
    }


    /**
     * @notice Get IPFS report hash only
     */
    function getAuditReport(string memory _contractName)
        external
        view
        returns (string memory)
    {
        require(audits[_contractName].exists, "Audit not found");
        return audits[_contractName].ipfsHash;
    }


    /**
     * @notice Get all audited contract names
     */
    function getAllAuditedContracts()
        external
        view
        returns (string[] memory)
    {
        return auditedContractNames;
    }


    /**
     * @notice Get basic statistics
     */
    function getStats()
        external
        view
        returns (
            uint256 _totalAudits,
            uint256 _safeContracts,
            uint256 _riskyContracts
        )
    {
        _totalAudits = totalAudits;
        for (uint256 i = 0; i < auditedContractNames.length; i++) {
            string memory name = auditedContractNames[i];
            uint8 score = audits[name].riskScore;
            if (score >= 7) {
                _safeContracts++;
            } else {
                _riskyContracts++;
            }
        }
    }


    /**
     * @notice Batch fetch audits for display
     */
    function getMultipleScores(string[] memory _contractNames)
        external
        view
        returns (uint8[] memory scores, bool[] memory exists)
    {
        scores = new uint8[](_contractNames.length);
        exists = new bool[](_contractNames.length);
        for (uint256 i = 0; i < _contractNames.length; i++) {
            AuditRecord memory audit = audits[_contractNames[i]];
            scores[i] = audit.riskScore;
            exists[i] = audit.exists;
        }
    }
}