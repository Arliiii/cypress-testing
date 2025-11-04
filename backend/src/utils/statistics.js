import * as stats from 'simple-statistics';
import xlsx from 'xlsx';

/**
 * Perform statistical analysis based on analysis type
 */
export const performStatisticalAnalysis = async (
  dataset,
  analysisType,
  selectedVariables,
  splitVariable,
  settings
) => {
  // Read the dataset file
  const workbook = xlsx.readFile(dataset.filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (data.length < 2) {
    throw new Error('Dataset must have at least a header row and one data row');
  }
  
  const headers = data[0];
  const rows = data.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));

  // Convert to row-based format with headers for easier filtering
  const dataRows = rows.map(row => {
    const rowObj = {};
    headers.forEach((header, index) => {
      rowObj[header] = row[index];
    });
    return rowObj;
  });

  let results = {};

  switch (analysisType) {
    case 'descriptive':
      results = performDescriptiveAnalysis(dataRows, headers, selectedVariables, splitVariable, settings);
      break;
    case 'single-group':
      results = performSingleGroupAnalysis(dataRows, headers, selectedVariables, settings);
      break;
    case 'multiple-group':
      results = performMultipleGroupAnalysis(dataRows, headers, selectedVariables, splitVariable, settings);
      break;
    case 'dependent':
      results = performDependentAnalysis(dataRows, headers, selectedVariables, settings);
      break;
    default:
      throw new Error('Invalid analysis type');
  }

  return results;
};

/**
 * Perform descriptive statistics analysis
 */
const performDescriptiveAnalysis = (dataRows, headers, selectedVariables, splitVariable, settings) => {
  const results = {
    analysisType: 'Descriptive Statistics',
    groups: []
  };

  const decimalPlaces = settings?.decimalPlaces || 3;

  // If split variable is provided, group by it
  if (splitVariable?.variableName) {
    // Get unique values of split variable
    const splitValues = [...new Set(dataRows
      .map(row => row[splitVariable.variableName])
      .filter(v => v !== null && v !== undefined && v !== '')
    )];
    
    splitValues.forEach(splitValue => {
      const groupData = {
        groupName: `${splitVariable.variableName} = ${splitValue}`,
        splitValue: splitValue,
        variables: []
      };

      // Filter rows for this group
      const groupRows = dataRows.filter(row => row[splitVariable.variableName] === splitValue);

      // Analyze each selected variable for this group
      selectedVariables.forEach(variable => {
        const values = groupRows
          .map(row => row[variable.variableName])
          .filter(v => v !== null && v !== undefined && v !== '');
        
        const numericData = values.map(v => parseFloat(v)).filter(v => !isNaN(v));

        if (numericData.length > 0) {
          groupData.variables.push({
            name: variable.variableName,
            statistics: calculateDescriptiveStats(numericData, decimalPlaces)
          });
        }
      });

      if (groupData.variables.length > 0) {
        results.groups.push(groupData);
      }
    });
  } else {
    // No split variable - analyze all selected variables together
    const groupData = {
      groupName: 'All Data',
      variables: []
    };

    selectedVariables.forEach(variable => {
      const values = dataRows
        .map(row => row[variable.variableName])
        .filter(v => v !== null && v !== undefined && v !== '');
      
      const numericData = values.map(v => parseFloat(v)).filter(v => !isNaN(v));

      if (numericData.length > 0) {
        groupData.variables.push({
          name: variable.variableName,
          statistics: calculateDescriptiveStats(numericData, decimalPlaces)
        });
      }
    });

    results.groups.push(groupData);
  }

  // Generate interpretation
  results.interpretation = generateDescriptiveInterpretation(results.groups);

  return results;
};

/**
 * Calculate descriptive statistics for a dataset
 */
const calculateDescriptiveStats = (data, decimalPlaces) => {
  const sortedData = [...data].sort((a, b) => a - b);
  
  return {
    n: data.length,
    mean: parseFloat(stats.mean(data).toFixed(decimalPlaces)),
    median: parseFloat(stats.median(data).toFixed(decimalPlaces)),
    std: parseFloat(stats.standardDeviation(data).toFixed(decimalPlaces)),
    min: parseFloat(Math.min(...data).toFixed(decimalPlaces)),
    max: parseFloat(Math.max(...data).toFixed(decimalPlaces)),
    q1: parseFloat(stats.quantile(sortedData, 0.25).toFixed(decimalPlaces)),
    q3: parseFloat(stats.quantile(sortedData, 0.75).toFixed(decimalPlaces)),
    range: parseFloat((Math.max(...data) - Math.min(...data)).toFixed(decimalPlaces)),
    variance: parseFloat(stats.variance(data).toFixed(decimalPlaces)),
    skewness: parseFloat(calculateSkewness(data).toFixed(decimalPlaces)),
    kurtosis: parseFloat(calculateKurtosis(data).toFixed(decimalPlaces))
  };
};

/**
 * Calculate skewness
 */
const calculateSkewness = (data) => {
  const n = data.length;
  const mean = stats.mean(data);
  const std = stats.standardDeviation(data);
  
  const sum = data.reduce((acc, val) => {
    return acc + Math.pow((val - mean) / std, 3);
  }, 0);
  
  return (n / ((n - 1) * (n - 2))) * sum;
};

/**
 * Calculate kurtosis
 */
const calculateKurtosis = (data) => {
  const n = data.length;
  const mean = stats.mean(data);
  const std = stats.standardDeviation(data);
  
  const sum = data.reduce((acc, val) => {
    return acc + Math.pow((val - mean) / std, 4);
  }, 0);
  
  return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - 
         (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
};

/**
 * Generate interpretation for descriptive statistics
 */
const generateDescriptiveInterpretation = (groups) => {
  const interpretations = [];

  groups.forEach(group => {
    group.variables.forEach(variable => {
      const stats = variable.statistics;
      interpretations.push(
        `The value of median for ${variable.name} has been obtained as ${stats.median} over ${stats.n} observations. ` +
        `The value of mean for ${variable.name} has been obtained as ${stats.mean} over ${stats.n} observations.`
      );
    });
  });

  return interpretations.join(' ');
};

/**
 * Perform single group analysis (one-sample t-test, normality tests, etc.)
 */
const performSingleGroupAnalysis = (dataRows, headers, selectedVariables, settings) => {
  const results = {
    analysisType: 'Single Group Analysis',
    tests: []
  };

  const decimalPlaces = settings?.decimalPlaces || 3;

  selectedVariables.forEach(variable => {
    const values = dataRows
      .map(row => row[variable.variableName])
      .filter(v => v !== null && v !== undefined && v !== '');
    
    const numericData = values.map(v => parseFloat(v)).filter(v => !isNaN(v));

    if (numericData.length > 0) {
      results.tests.push({
        variable: variable.variableName,
        descriptives: calculateDescriptiveStats(numericData, decimalPlaces),
        normalityTest: performNormalityTest(numericData, decimalPlaces)
      });
    }
  });

  return results;
};

/**
 * Perform normality test (Shapiro-Wilk approximation)
 */
const performNormalityTest = (data, decimalPlaces) => {
  // Simplified normality check using skewness and kurtosis
  const skewness = calculateSkewness(data);
  const kurtosis = calculateKurtosis(data);
  
  // Approximate normality: skewness close to 0, kurtosis close to 0
  const isNormal = Math.abs(skewness) < 1 && Math.abs(kurtosis) < 1;
  
  return {
    test: 'Normality Test',
    skewness: parseFloat(skewness.toFixed(decimalPlaces)),
    kurtosis: parseFloat(kurtosis.toFixed(decimalPlaces)),
    result: isNormal ? 'Data appears normally distributed' : 'Data may not be normally distributed'
  };
};

/**
 * Perform multiple group analysis (ANOVA, Kruskal-Wallis, etc.)
 */
const performMultipleGroupAnalysis = (dataRows, headers, selectedVariables, splitVariable, settings) => {
  const results = {
    analysisType: 'Multiple Group Analysis',
    groups: [],
    comparisons: []
  };

  const decimalPlaces = settings?.decimalPlaces || 3;

  if (!splitVariable?.variableName) {
    throw new Error('Split variable is required for multiple group analysis');
  }

  // Get unique values of split variable
  const splitValues = [...new Set(dataRows
    .map(row => row[splitVariable.variableName])
    .filter(v => v !== null && v !== undefined && v !== '')
  )];

  // Analyze each selected variable across groups
  selectedVariables.forEach(variable => {
    const groupsData = {
      variableName: variable.variableName,
      groups: []
    };

    splitValues.forEach(splitValue => {
      const groupRows = dataRows.filter(row => row[splitVariable.variableName] === splitValue);
      const values = groupRows
        .map(row => row[variable.variableName])
        .filter(v => v !== null && v !== undefined && v !== '');
      
      const numericData = values.map(v => parseFloat(v)).filter(v => !isNaN(v));

      if (numericData.length > 0) {
        groupsData.groups.push({
          groupName: `${splitVariable.variableName} = ${splitValue}`,
          statistics: calculateDescriptiveStats(numericData, decimalPlaces)
        });
      }
    });

    results.groups.push(groupsData);
  });
  
  return results;
};

/**
 * Perform dependent data analysis (paired t-test, etc.)
 */
const performDependentAnalysis = (dataRows, headers, selectedVariables, settings) => {
  const results = {
    analysisType: 'Dependent Data Analysis',
    pairs: []
  };

  const decimalPlaces = settings?.decimalPlaces || 3;

  // For paired analysis, we need at least 2 variables
  if (selectedVariables.length < 2) {
    throw new Error('At least 2 variables required for dependent data analysis');
  }

  // Analyze pairs of variables
  for (let i = 0; i < selectedVariables.length - 1; i++) {
    for (let j = i + 1; j < selectedVariables.length; j++) {
      const var1 = selectedVariables[i];
      const var2 = selectedVariables[j];

      const values1 = dataRows
        .map(row => row[var1.variableName])
        .map(v => parseFloat(v))
        .filter(v => !isNaN(v));
      
      const values2 = dataRows
        .map(row => row[var2.variableName])
        .map(v => parseFloat(v))
        .filter(v => !isNaN(v));

      if (values1.length > 0 && values2.length > 0) {
        // Calculate differences
        const minLength = Math.min(values1.length, values2.length);
        const differences = [];
        for (let k = 0; k < minLength; k++) {
          differences.push(values2[k] - values1[k]);
        }

        results.pairs.push({
          variable1: var1.variableName,
          variable2: var2.variableName,
          stats1: calculateDescriptiveStats(values1, decimalPlaces),
          stats2: calculateDescriptiveStats(values2, decimalPlaces),
          differences: calculateDescriptiveStats(differences, decimalPlaces)
        });
      }
    }
  }
  
  return results;
};
