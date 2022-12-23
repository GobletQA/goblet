
function retryFailedTests(retries, millisecondsBetweenRetries, setTimeout) {
  const originalSpecConstructor = jasmine.Spec;

  jasmine.Spec = function(attrs) {
    const spec = new originalSpecConstructor(attrs);
    const originalTestFn = spec.queueableFn.fn;

    // Handles both styles of async testing (Promises and done()) and returns a
    // Promise.  Wraps synchronous tests in a Promise, too.
    const runOriginalTest = () => {
      console.log('Running original test');
      if (originalTestFn.length == 0) {
        return originalTestFn();
      } else {
        return new Promise((resolve) => {
          originalTestFn(resolve);
        });
      }
    };

    spec.queueableFn.fn = async function() {
      let exceptionCaught;
      let returnValue;

      for (let i = 0; i < retries; ++i) {
        spec.reset();
        returnValue = undefined;
        exceptionCaught = undefined;

        try {
          returnValue = await runOriginalTest();
        } catch (exception) {
          exceptionCaught = exception;
        }
        const failed = !spec.markedPending &&
            (exceptionCaught || spec.result.failedExpectations.length != 0);
        if (!failed) {
          break;
        }

        if (millisecondsBetweenRetries && i != retries - 1) {
          await new Promise((resolve) => {
            setTimeout(resolve, millisecondsBetweenRetries);
          });
        }
      }

      if (exceptionCaught) {
        throw exceptionCaught;
      }
      return returnValue;
    };

    return spec;
  };
}