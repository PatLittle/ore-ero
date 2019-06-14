// Put code in here.
// Embed this at the bottom of the body.
/* global $ YamlWriter USERNAME REPO_NAME jsyaml PRBOT_URL */

function getSelectedOrgType() {
  return $('#adminCode :selected')
    .parent()
    .attr('label')
    .toLowerCase();
}

function getAdminObject() {
  let adminObject = {
    code: $('#adminCode').val(),
    provinceCode: $('#provinceCode').val(),
    name: {
      en: $('#enOrganisationName').val(),
      fr: $('#frOrganisationName').val()
    }
  };
  return adminObject;
}

function getCodeObject() {
  // Required fields are included first.
  let codeObject = {
    schemaVersion: $('#schemaVersion').val(),
    adminCode: $('#adminCode').val(),
    releases: [
      {
        contact: {
          email: $('#emailContact').val()
        },
        date: {
          created: $('#dateCreated')
            .val()
            .toString(),
          metadataLastUpdated: $('#dateLastUpdated')
            .val()
            .toString()
        },
        description: {
          en: $('#enDescription').val(),
          fr: $('#frDescription').val()
        },
        name: {
          en: $('#enProjectName').val(),
          fr: $('#frProjectName').val()
        },
        licenses: [
          {
            URL: {
              en: $('#enLicenses').val(),
              fr: $('#frLicenses').val()
            },
            spdxID: $('#spdxID').val()
          }
        ],
        repositoryURL: {
          en: $('#enRepositoryUrl').val(),
          fr: $('#frRepositoryUrl').val()
        },
        tags: {
          en: getTags([...document.querySelectorAll('#tagsEN input')]),
          fr: getTags([...document.querySelectorAll('#tagsFR input')])
        }
      }
    ]
  };

  // Then we handle all optional fields.

  // contact.URL
  if ($('#frUrlContact').val() || $('#enUrlContact').val()) {
    codeObject.releases[0].contact.URL = {};
  }
  if ($('#enUrlContact').val()) {
    codeObject.releases[0].contact.URL.en = $('#enUrlContact').val();
  }
  if ($('#frUrlContact').val()) {
    codeObject.releases[0].contact.URL.fr = $('#frUrlContact').val();
  }

  // contact.name, TODO: update to match schema
  if ($('#nameContact').val()) {
    codeObject.releases[0].contact.name = $('#nameContact').val();
  }

  // contact.phone
  if ($('#phone').val()) {
    codeObject.releases[0].contact.phone = $('#phone').val();
  }

  // date.lastModified
  if ($('#dateLastModified').val()) {
    codeObject.releases[0].date.lastModified = $('#dateLastModified')
      .val()
      .toString();
  }

  // downloadURL
  if ($('#enDownloadUrl').val() || $('#frDownloadUrl').val()) {
    codeObject.releases[0].downloadURL = {};
  }
  if ($('#enDownloadUrl').val()) {
    codeObject.releases[0].downloadURL.en = $('#enDownloadUrl').val();
  }
  if ($('#frDownloadUrl').val()) {
    codeObject.releases[0].downloadURL.fr = $('#frDownloadUrl').val();
  }

  // homepageURL
  if ($('#enHomepageURL').val() || $('#frHomepageURL').val()) {
    codeObject.releases[0].homepageURL = {};
  }
  if ($('#enHomepageURL').val()) {
    codeObject.releases[0].homepageURL.en = $('#enHomepageURL').val();
  }
  if ($('#frHomepageURL').val()) {
    codeObject.releases[0].homepageURL.fr = $('#frHomepageURL').val();
  }

  // languages
  let languages = $(
    'input[data-for="languages"]:checked, input[data-for="languages"][type="text"]'
  )
    .toArray()
    .map(input => input.value);
  if (languages.length > 0) {
    codeObject.releases[0].languages = languages;
  }

  // organization
  if ($('#enOrganization').val() || $('#frOrganization').val()) {
    codeObject.releases[0].organization = {};
  }
  if ($('#enOrganization').val()) {
    codeObject.releases[0].organization.en = $('#enOrganization').val();
  }
  if ($('#frOrganization').val()) {
    codeObject.releases[0].organization.fr = $('#frOrganization').val();
  }

  // partners
  if (
    $('#enUrlPartner').val() ||
    $('#frUrlPartner').val() ||
    $('#emailPartner').val() ||
    $('#enNamePartner').val() ||
    $('#frNamePartner').val()
  ) {
    codeObject.releases[0].partners = {};
  }
  // partners.URL
  if ($('#enUrlPartner').val() || $('#frUrlPartner').val()) {
    codeObject.releases[0].partners.URL = {};
  }
  if ($('#enUrlPartner').val()) {
    codeObject.releases[0].partners.URL.en = $('#enUrlPartner').val();
  }
  if ($('#frUrlPartner').val()) {
    codeObject.releases[0].partners.URL.fr = $('#frUrlPartner').val();
  }
  // partners.email
  if ($('#emailPartner').val()) {
    codeObject.releases[0].partners.email = $('#emailPartner').val();
  }
  // partners.name
  if ($('#enNamePartner').val() || $('#frNamePartner').val()) {
    codeObject.releases[0].partners.name = {};
  }
  if ($('#enNamePartner').val()) {
    codeObject.releases[0].partners.name.en = $('#enNamePartner').val();
  }
  if ($('#frNamePartner').val()) {
    codeObject.releases[0].partners.name.fr = $('#frNamePartner').val();
  }

  // relatedCode TODO: support multiple relatedCode fields
  if (
    $('#enUrlRelatedCode').val() ||
    $('#frUrlRelatedCode').val() ||
    $('#enNameRelatedCode').val() ||
    $('#frNameRelatedCode').val()
  ) {
    codeObject.releases[0].relatedCode = [{}];
  }
  // relatedCode.URL
  if ($('#enUrlRelatedCode').val() || $('#frUrlRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].URL = {};
  }
  if ($('#enUrlRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].URL.en = $('#enUrlRelatedCode').val();
  }
  if ($('#frUrlRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].URL.fr = $('#frUrlRelatedCode').val();
  }
  // relatedCode.name
  if ($('#enNameRelatedCode').val() || $('#frNameRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].name = {};
  }
  if ($('#enNameRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].name.en = $(
      '#enNameRelatedCode'
    ).val();
  }
  if ($('#frNameRelatedCode').val()) {
    codeObject.releases[0].relatedCode[0].name.fr = $(
      '#frNameRelatedCode'
    ).val();
  }

  // status
  if ($('#status :selected').val() != '') {
    codeObject.releases[0].status = $('#status :selected').val();
  }

  // version
  if ($('#VersionProject').val()) {
    codeObject.releases[0].version = $('#VersionProject').val();
  }

  // vcs
  if ($('#Vcs').val()) {
    codeObject.releases[0].vcs = $('#Vcs').val();
  }

  return codeObject;
}

function getTags(query) {
  return $(query)
    .map(function() {
      return this.value ? this.value : null;
    })
    .get();
}

/**
 * Validates the required fields in the codeForm
 * WET uses the JQuery plugin (https://jqueryvalidation.org/) for their form validation
 * @return {Boolean} true/false if the form is valid/invalid
 */
function validateRequired() {
  let form = document.getElementById('validation');
  let elements = form.elements;
  let validator = $('#validation').validate();
  let isValid = true;
  for (let i = 0; i < elements.length; i++) {
    let currentElement = elements[i];
    if (currentElement.required) {
      if (!validator.element('#' + currentElement.id)) {
        isValid = false;
      }
    }
  }
  if (!isValid) {
    // Jump to top of form to see error messages
    location.href = '#wb-cont';
  }
  return isValid;
}

const ALERT_IN_PROGRESS = 0;
const ALERT_FAIL = 1;
const ALERT_SUCCESS = 2;
const ALERT_OFF = 3;

function toggleAlert(option) {
  let alertInProgress = document.getElementById('prbotSubmitAlertInProgress');
  let alertFail = document.getElementById('prbotSubmitAlertFail');
  let alertSuccess = document.getElementById('prbotSubmitAlertSuccess');
  if (option == ALERT_IN_PROGRESS) {
    alertInProgress.style.display = 'block';
  } else if (option == ALERT_FAIL) {
    alertFail.style.display = 'block';
  } else if (option == ALERT_SUCCESS) {
    alertSuccess.style.display = 'block';
  } else if (option == ALERT_OFF) {
    alertInProgress.style.display = 'none';
    alertFail.style.display = 'none';
    alertSuccess.style.display = 'none';
  } else {
    console.log('Invalid alert option');
  }
}

function submitForm() {
  let submitButton = document.getElementById('prbotSubmitcodeForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let codeObject = getCodeObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/code/${getSelectedOrgType()}/${$('#adminCode').val()}.yml`;
  fileWriter
    .merge(file, codeObject, 'releases', 'name.en')
    .then(result => {
      const config = {
        body: JSON.stringify({
          user: USERNAME,
          repo: REPO_NAME,
          title: 'Updated code for ' + $('#adminCode :selected').text(),
          description:
            'Authored by: ' +
            $('#submitterEmail').val() +
            '\n' +
            'Project: ***' +
            $('#enProjectName').val() +
            '***\n' +
            $('#enDescription').val() +
            '\n',
          commit: 'Committed by ' + $('#submitterEmail').val(),
          author: {
            name: $('#submitterUsername').val(),
            email: $('#submitterEmail').val()
          },
          files: [
            {
              path: file,
              content: jsyaml.dump(result, { lineWidth: 160 })
            }
          ]
        }),
        method: 'POST'
      };
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        // We need to create the file for this organization, as it doesn't yet exist.
        const config = {
          body: JSON.stringify({
            user: USERNAME,
            repo: REPO_NAME,
            title: 'Created code file for ' + $('#adminCode :selected').text(),
            description:
              'Authored by: ' +
              $('#submitterEmail').val() +
              '\n' +
              'Project: ***' +
              $('#enProjectName').val() +
              '***\n' +
              $('#enDescription').val() +
              '\n',
            commit: 'Committed by ' + $('#submitterEmail').val(),
            author: {
              name: $('#submitterUsername').val(),
              email: $('#submitterEmail').val()
            },
            files: [
              {
                path: file,
                content:
                  '---\n' +
                  jsyaml.dump(codeObject, {
                    lineWidth: 160
                  })
              }
            ]
          }),
          method: 'POST'
        };
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
    })
    .then(response => {
      if (response.status != 200) {
        toggleAlert(ALERT_OFF);
        toggleAlert(ALERT_FAIL);
        submitButton.disabled = false;
        resetButton.disabled = false;
      } else {
        toggleAlert(ALERT_OFF);
        toggleAlert(ALERT_SUCCESS);
        // Redirect to home page
        setTimeout(function() {
          window.location.href = './index.html';
        }, 2000);
      }
    });
}

function submitAdminForm() {
  let submitButton = document.getElementById('prbotSubmitadminForm');
  let resetButton = document.getElementById('formReset');
  submitButton.disabled = true;
  resetButton.disabled = true;

  let adminObject = getAdminObject();
  let fileWriter = new YamlWriter(USERNAME, REPO_NAME);
  let file = `_data/administrations/${$('#orgLevel').val()}.yml`;

  fileWriter
    .mergeAdminFile(file, adminObject, '', 'code')
    .then(result => {
      const config = {
        body: JSON.stringify({
          user: USERNAME,
          repo: REPO_NAME,
          title: `Updated the ${$('#orgLevel').val()} file`,
          description: 'Authored by: ' + $('#submitterEmail').val() + '\n',
          commit: 'Committed by ' + $('#submitterEmail').val(),
          author: {
            name: $('#submitterUsername').val(),
            email: $('#submitterEmail').val()
          },
          files: [
            {
              path: file,
              content: jsyaml.dump(result)
            }
          ]
        }),
        method: 'POST'
      };
      return fetch(PRBOT_URL, config);
    })
    .catch(err => {
      if (err.status == 404) {
        const config = {
          body: JSON.stringify({
            user: USERNAME,
            repo: REPO_NAME,
            title: 'Created an administration file',
            description: 'Authored by: ' + $('#submitterEmail').val() + '\n',
            commit: 'Committed by ' + $('#submitterEmail').val(),
            author: {
              name: $('#submitterUsername').val(),
              email: $('#submitterEmail').val()
            },
            files: [
              {
                path: file,
                content:
                  '---\n' +
                  jsyaml.dump(adminObject, {
                    lineWidth: 160
                  })
              }
            ]
          }),
          method: 'POST'
        };
        return fetch(PRBOT_URL, config);
      } else {
        throw err;
      }
    })
    .then(response => {
      if (response.status != 200) {
        toggleAlert(ALERT_OFF);
        toggleAlert(ALERT_FAIL);
        submitButton.disabled = false;
        resetButton.disabled = false;
      } else {
        toggleAlert(ALERT_OFF);
        toggleAlert(ALERT_SUCCESS);
        // Redirect to home page
        setTimeout(function() {
          window.location.href = './index.html';
        }, 2000);
      }
    });
}

$('#prbotSubmitcodeForm').click(function() {
  // Progress only when form input is valid
  if (validateRequired()) {
    toggleAlert(ALERT_OFF);
    toggleAlert(ALERT_IN_PROGRESS);
    window.scrollTo(0, document.body.scrollHeight);
    submitForm();
  }
});

$('#prbotSubmitadminForm').click(function() {
  // Progress only when form input is valid
  if (validateRequired()) {
    toggleAlert(ALERT_OFF);
    toggleAlert(ALERT_IN_PROGRESS);
    window.scrollTo(0, document.body.scrollHeight);
    submitAdminForm();
  }
});
